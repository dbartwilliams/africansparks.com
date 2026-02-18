// controllers/notificationController.js
import Notification from '../models/Notification.js';
import Comment from '../models/Comment.js';
import mongoose from 'mongoose';

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const notifications = await Notification.find({ recipient: userObjectId })
    .populate('actor', 'userName userAvatar')
    .populate({
      path: 'spark',  // ✅ ADD THIS
      select: 'content images author createdAt',
      populate: {
        path: 'author',
        select: 'userName userAvatar'
      }
    })

      .populate('actor', 'userName userAvatar')
      .populate({
        path: 'comment',
        select: 'content author createdAt',
        populate: {
          path: 'author',
          select: 'userName userAvatar',
        },
      })
      .sort({ createdAt: -1 })
      .limit(50)


      // In getUserNotifications, after query:
      notifications.forEach(n => {
        console.log(`Notif ${n.type}:`, {
          actorType: typeof n.actor,
          actorIsObjectId: n.actor instanceof mongoose.Types.ObjectId,
          actorIsObject: typeof n.actor === 'object' && n.actor !== null,
          hasUserName: n.actor?.userName ? 'YES' : 'NO',
        });
      });


      // <-- ADD THIS LINE
    console.log('Notifications fetched:', JSON.stringify(notifications, null, 2));

    const unreadCount = await Notification.countDocuments({
      recipient: userObjectId,
      read: false
    });

    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const markNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Mark all unread as read
    await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }
    );
    
    res.json({ message: 'Notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};