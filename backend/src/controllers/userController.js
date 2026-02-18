import {User} from "../models/User.js";
import Spark from "../models/Spark.js";
import  Notification  from '../models/Notification.js'; 
import { uploadToImageKit } from "../utils/imageKit.js";

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const toggleConnect = async (req, res) => {
  const { id: targetUserId } = req.params;
  const currentUserId = req.user.id;

  console.log('🔥 toggleConnect:', { targetUserId, currentUserId });

  if (targetUserId === currentUserId.toString()) {
    return res.status(400).json({ message: "Cannot connect to yourself" });
  }

  try {
    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAlreadyConnected = targetUser.connections.includes(currentUserId);

    if (isAlreadyConnected) {
      // ✅ DISCONNECT - Remove the notification too
      targetUser.connections.pull(currentUserId);
      currentUser.connectings.pull(targetUserId);
      
      // ✅ DELETE the connect notification
      await Notification.deleteOne({
        recipient: targetUserId,
        actor: currentUserId,
        type: "connect"
      });
      
      await Promise.all([targetUser.save(), currentUser.save()]);

      return res.status(200).json({ 
        message: "Disconnected", 
        isConnected: false 
      });
    } 

    // ✅ CONNECT LOGIC
    targetUser.connections.push(currentUserId);
    currentUser.connectings.push(targetUserId);
    
    await Promise.all([targetUser.save(), currentUser.save()]);
    console.log('✅ Users updated');

    // ✅ CREATE notification (fixed variable shadowing)
    let notification = null;
    try {
      notification = await Notification.create({
        recipient: new mongoose.Types.ObjectId(targetUserId),
        actor: new mongoose.Types.ObjectId(currentUserId),
        type: "connect",
        read: false,
      });
      console.log('✅ Notification created:', notification._id);
    } catch (notifError) {
      console.error('❌ Notification.create() FAILED:', notifError.message);
    }

    return res.status(200).json({
      message: "Connected",
      isConnected: true,
      connectionsCount: targetUser.connections.length,
      connectingsCount: currentUser.connectings.length,
      notificationId: notification?._id || null,
    });

  } catch (error) {
    console.error('toggleConnect error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getLatestUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 2;
    const currentUserId = req.user?.id;

    // Find users except current user, sorted by newest first
    const users = await User.find({ 
      _id: { $ne: currentUserId }  // Exclude current user
    })
      .sort({ createdAt: -1 })     // Latest first
      .limit(limit)
      .select('firstName lastName userName userAvatar connections');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update user profile (avatar, bio, etc.)
export const updateUser = async (req, res) => {
  try {

    console.log('=== UPDATE USER DEBUG ===');
    console.log('req.file:', req.file); // Should show the file object
    console.log('req.body:', req.body); // Should show other fields

    const userId = req.user.id;
    const updates = {};
    
    if (req.file) {
      console.log('File found, uploading to ImageKit...');
      const result = await uploadToImageKit(
        req.file.buffer, 
        req.file.originalname, 
        '/sparkAvatar'
      );
      console.log('ImageKit result:', result);
      updates.userAvatar = result.fileName;
      console.log('updates.userAvatar set to:', updates.userAvatar);

    } else {
      console.log('No file found in req.file');
    }
    
    // Handle other fields...
    const allowedFields = ['bio', 'location', 'website', 'firstName', 'lastName'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    console.log('Updated user from DB:', updatedUser);
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserSparks = async (req, res) => {
  try {
    const { id } = req.params;

    // Make sure user exists
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get sparks for this user and populate author info
    const sparks = await Spark.find({ author: id })
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

    res.status(200).json(sparks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
