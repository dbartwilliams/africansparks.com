// controllers/likeController.js
import Like from '../models/Like.js';
import Spark from '../models/Spark.js';
import Notification from '../models/Notification.js';

export const toggleLike = async (req, res) => {
  try {
    const { sparkId } = req.params;
    const userId = req.user.id;

    // Check if like exists
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
      // Unlike: delete the like document
      await Like.deleteOne({ _id: existingLike._id });
      
      // Decrement count
      await Spark.findByIdAndUpdate(sparkId, {
        $inc: { likesCount: -1 }
      });

      return res.json({ liked: false, likesCount: spark.likesCount - 1 });
    }

    // Like: create new like document
    await Like.create({
      user: userId,
      targetType: 'Spark',
      targetId: sparkId,
    });

    // Increment count
    await Spark.findByIdAndUpdate(sparkId, {
      $inc: { likesCount: 1 }
    });

    // Create notification (if not own spark)
    if (spark.author.toString() !== userId) {
      await Notification.create({
        recipient: spark.author,
        actor: userId,
        type: 'like',
        spark: sparkId,
      });
    }

    res.json({ liked: true, likesCount: spark.likesCount + 1 });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};