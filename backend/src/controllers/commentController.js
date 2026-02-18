import Spark from "../models/Spark.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";


/* CREATE COMMENT */
export const createComment = async (req, res) => {
  try {
    console.log('REQ.BODY:', req.body);
    console.log('REQ.USER:', req.user); // Changed from req.userId

    const { content, sparkId } = req.body;
    const userId = req.user?.id; // Use req.user.id (not req.userId)

    // Validation 1: Check for empty content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    // Validation 2: Check content length
    if (content.length > 280) {
      return res.status(400).json({ message: "Comment too long (max 280 chars)" });
    }

    // Get the spark
    const spark = await Spark.findById(sparkId);

    if (!spark) {
      return res.status(404).json({ message: "Spark not found" });
    }

    // Validation 3: Check if user is commenting on their own spark
    if (spark.author.toString() === userId) {
      return res.status(400).json({ message: "Cannot comment on your own spark" });
    }

    // Create the comment
    const comment = await Comment.create({
      author: userId,
      spark: sparkId,
      content: content.trim(),
    });

    console.log('Comment created:', comment._id);

    // Update spark's comment count
    const updatedSpark = await Spark.findByIdAndUpdate(
      sparkId,
      { $inc: { commentsCount: 1 } },
      { new: true }
    );
    
    console.log('Updated commentsCount:', updatedSpark.commentsCount);

    // ✅ Create notification for spark author
    await Notification.create({
      recipient: spark.author,
      actor: userId,
      type: "comment",
      spark: sparkId,
      comment: comment._id,
      content: content.trim(), // Add this line - stores the comment text
    });

    console.log('Notification created');

    // Populate author info for response
    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "userName firstName lastName userAvatar");

    res.status(201).json(populatedComment);

  } catch (err) {
    console.error('createComment error:', err);
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL COMMENTS */
export const getAllComments = async (req, res) => {
  try {
    const { sparkId } = req.params;

    const comments = await Comment.find({ spark: sparkId, isDeleted: false })
      .populate("author", "userName userAvatar")
      .populate("spark", "_id content")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* GET COMMENTS FOR A SPARKID */
export const getCommentsBySparkId = async (req, res) => {
  try {
    const { sparkId } = req.params;

    const comments = await Comment.find({ spark: sparkId })
      .populate("author", "userName firstName lastName userAvatar")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


/* DELETE COMMENT */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only author can delete
    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.isDeleted = true;
    await comment.save();

    // Decrease spark's comment count
    await Spark.findByIdAndUpdate(comment.spark, {
      $inc: { commentsCount: -1 }
    });

    res.status(200).json({ message: "Comment deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

