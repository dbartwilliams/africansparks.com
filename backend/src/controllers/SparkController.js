
import Spark from "../models/Spark.js";
import { uploadToImageKit } from "../utils/imageKit.js";
import Notification from "../models/Notification.js";
import Respark from '../models/Respark.js';
import Comment from "../models/Comment.js";
import {User} from "../models/User.js";
import Like from '../models/Like.js'; 
import mongoose from 'mongoose';

/* CREATE_SPARKS */
export const createSpark = async (req, res) => {
  try {
    const { content } = req.body;

    let images = []; // Changed to array

    // ✅ Handle multiple file uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToImageKit(file.buffer, file.originalname, '/spark');
        images.push(result.fileName);
      }
    }

    // Prevent empty spark
    if (!content?.trim() && images.length === 0) {
      return res.status(400).json({ message: "Cannot create an empty spark." });
    }

    // ✅ Save Spark with images array
    const newSpark = new Spark({
      author: req.user.id,
      content: content?.trim() || "",
      images, // Array of filenames
    });

    await newSpark.save();

    // ✅ Populate author info
    const populatedSpark = await Spark.findById(newSpark._id)
      .populate("author", "userName firstName lastName userAvatar");

    // ✅ Build response - handle single image for backward compatibility
    const formatted = {
      _id: populatedSpark._id,
      content: populatedSpark.content,
      images: populatedSpark.images,
      image: populatedSpark.images[0] || null, // First image for old clients
      name: `${populatedSpark.author.firstName} ${populatedSpark.author.lastName}`,
      handle: `@${populatedSpark.author.userName}`,
      avatar: populatedSpark.author.userAvatar,
      createdAt: populatedSpark.createdAt,
    };

    res.status(201).json(formatted);
  } catch (err) {
    console.error('createSpark error:', err);
    res.status(500).json({ message: err.message });
  }
};


/* DELETE */
export const deleteSpark = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // From auth middleware

    const spark = await Spark.findById(id);
    
    if (!spark) {
      return res.status(404).json({ success: false, message: 'Spark not found' });
    }

    if (spark.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await Spark.findByIdAndDelete(id);
    
    res.status(200).json({ success: true, message: 'Spark deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* LIKE / UNLIKE SPARK */
export const toggleLike = async (req, res) => {
  try {
    const { sparkId } = req.params;
    const userId = req.user.id;  

    const existingLike = await Like.findOne({
      user: userId,
      targetType: 'Spark',
      targetId: sparkId,
    });

    const spark = await Spark.findById(sparkId);

    if (!spark) {
      return res.status(404).json({ message: 'Spark not found' });
    }

    if (existingLike) {
      // Unlike: remove from array and delete Like document
      spark.likes.pull(userId);
      await spark.save();
      await Like.deleteOne({ _id: existingLike._id });

      return res.json({ 
        liked: false, 
        likesCount: spark.likes.length 
      });
    }

    // Like: add to array and create Like document
    spark.likes.push(userId);
    await spark.save();
    
    await Like.create({
      user: userId,
      targetType: 'Spark',
      targetId: sparkId,
    });

    // Create notification
    if (spark.author.toString() !== userId) {
      await Notification.create({
        recipient: spark.author,
        actor: userId,
        type: 'like',
        spark: sparkId,
      });
    }

    res.json({ 
      liked: true, 
      likesCount: spark.likes.length 
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const toggleRespark = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const originalSpark = await Spark.findById(id).populate('author', '_id userName');

    if (!originalSpark) {
      return res.status(404).json({ message: 'Spark not found' });
    }

    // Check if user already resparked (using the array)
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const alreadyResparked = originalSpark.resparks.some(r => r.toString() === userId);

    if (alreadyResparked) {
      // Un-respark: remove from array
      originalSpark.resparks.pull(userObjectId);
      await originalSpark.save();

      // Delete the respark document
      await Spark.deleteOne({ isReSpark: true, originalSpark: id, reSparkedBy: userId });

      // Return updated count (virtual will compute from array)
      const updatedSpark = await Spark.findById(id); // Refresh to get virtual
      return res.json({ 
        resparked: false, 
        resparksCount: updatedSpark.resparksCount 
      });
    }

    // Create respark document
    const respark = await Spark.create({
      author: userObjectId,
      content: originalSpark.content,
      images: originalSpark.images || [],
      isReSpark: true,
      originalSpark: new mongoose.Types.ObjectId(id),
      reSparkedBy: userObjectId,
    });

    // Add to resparks array
    originalSpark.resparks.push(userObjectId);
    await originalSpark.save();

    // Notification
    if (originalSpark.author._id.toString() !== userId) {
      await Notification.create({
        recipient: originalSpark.author._id,
        actor: userObjectId,
        type: 'respark',
        spark: respark._id,
      });
    }

    // Refresh to get virtual count
    const updatedSpark = await Spark.findById(id);
    res.status(201).json({ 
      resparked: true, 
      resparksCount: updatedSpark.resparksCount,
      resparkId: respark._id 
    });

  } catch (err) {
    console.error('toggleRespark error:', err);
    res.status(500).json({ message: err.message });
  }
};

/* GET_ALL_SPARKS */
export const getAllSparks = async (req, res) => {
  try {
    const userId = req.user?.id;

    const sparks = await Spark.find()
      .sort({ createdAt: -1 })
      .populate("author", "userName firstName lastName userAvatar")
      .populate({
        path: 'originalSpark',
        select: 'content images image author createdAt',
        populate: {
          path: 'author',
          select: 'userName firstName lastName userAvatar'
        }
      });

    console.log('Resparks found:', sparks.filter(s => s.isReSpark).length);
    console.log('Sample respark original:', sparks.find(s => s.isReSpark)?.originalSpark);

    const formattedSparks = sparks.map(spark => {
      if (!spark.author) {
        console.log('⚠️ Spark missing author:', spark._id);
        return null;
      }
      
      const sparkObj = spark.toObject({ virtuals: true });
      
      // ✅ FORMAT ORIGINAL SPARK WITH ALL DATA
      let originalSparkData = null;
      if (spark.isReSpark && spark.originalSpark) {
        originalSparkData = {
          _id: spark.originalSpark._id.toString(),
          content: spark.originalSpark.content,
          images: spark.originalSpark.images || [],
          createdAt: spark.originalSpark.createdAt,
          author: spark.originalSpark.author ? {
            _id: spark.originalSpark.author._id.toString(),
            userName: spark.originalSpark.author.userName,
            firstName: spark.originalSpark.author.firstName,
            lastName: spark.originalSpark.author.lastName,
            userAvatar: spark.originalSpark.author.userAvatar,
          } : null
        };
      }

      return {
        _id: spark._id.toString(),
        content: spark.content,
        images: spark.images || [],
        authorId: spark.author._id?.toString(),
        name: `${spark.author.firstName} ${spark.author.lastName}`,
        handle: `@${spark.author.userName}`,
        userAvatar: spark.author.userAvatar,
        likesCount: sparkObj.likesCount || 0,
        resparksCount: sparkObj.resparksCount || 0,
        commentsCount: spark.commentsCount || 0,
        createdAt: spark.createdAt,
        isResparked: spark.resparks?.some(r => r.toString() === userId) || false,
        isReSpark: spark.isReSpark || false,
        originalSpark: originalSparkData // ✅ Now has full data
      };
    }).filter(Boolean);

    res.status(200).json(formattedSparks);
    
  } catch (err) {
    console.error('getAllSparks error:', err);
    res.status(500).json({ message: err.message });
  }
};

/* GET_SPARK_BY_ID */
export const getSparkById = async (req, res) => {
  try {
    const { sparkId } = req.params;

    if (!sparkId) {
      return res.status(400).json({ message: "Spark ID is required" });
    }

    const spark = await Spark.findById(sparkId)
    .populate("author", "userName firstName lastName userAvatar")
    // 👆 choose fields you want

    if (!spark) {
      return res.status(404).json({ message: "Spark not found" });
    }

    res.json(spark);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getConnectingSparks = async (req, res) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select("connectings");
    
    const connectingIds = user?.connectings || [];
    
    if (connectingIds.length === 0) {
      return res.status(200).json([]); // Empty - no one followed
    }

    const sparks = await Spark.find({
      $or: [
        { author: { $in: connectingIds }, isReSpark: { $ne: true } },
        { isReSpark: true, reSparkedBy: { $in: connectingIds } }
      ]
    })
    .populate("author", "userName firstName lastName userAvatar")
    .populate({
      path: 'originalSpark',
      select: 'content images author createdAt',
      populate: {
        path: 'author',
        select: 'userName firstName lastName userAvatar'
      }
    })
    .sort({ createdAt: -1 });

    // Format
    const formattedSparks = sparks.map(spark => {
      const sparkObj = spark.toObject({ virtuals: true });
      
      let originalSparkData = null;
      if (spark.isReSpark && spark.originalSpark) {
        originalSparkData = {
          _id: spark.originalSpark._id.toString(),
          content: spark.originalSpark.content,
          images: spark.originalSpark.images || [],
          createdAt: spark.originalSpark.createdAt,
          author: spark.originalSpark.author ? {
            _id: spark.originalSpark.author._id.toString(),
            userName: spark.originalSpark.author.userName,
            firstName: spark.originalSpark.author.firstName,
            lastName: spark.originalSpark.author.lastName,
            userAvatar: spark.originalSpark.author.userAvatar,
          } : null
        };
      }

      return {
        _id: spark._id.toString(),
        content: spark.content,
        images: spark.images || [],
        authorId: spark.author?._id?.toString(),
        name: spark.author ? `${spark.author.firstName} ${spark.author.lastName}` : 'Unknown',
        handle: `@${spark.author?.userName || 'unknown'}`,
        userAvatar: spark.author?.userAvatar,
        likesCount: sparkObj.likesCount || 0,
        resparksCount: sparkObj.resparksCount || 0,
        commentsCount: spark.commentsCount || 0,
        createdAt: spark.createdAt,
        isResparked: spark.resparks?.some(r => r.toString() === userId) || false,
        isReSpark: spark.isReSpark || false,
        originalSpark: originalSparkData
      };
    });

    res.status(200).json(formattedSparks);
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};