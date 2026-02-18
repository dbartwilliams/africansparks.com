// routes/notificationRoutes.js
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { 
    getUserNotifications, 
    markNotificationsAsRead
 } from '../controllers/notificationController.js'; // IMPORT

const router = express.Router();

// CALL the controller function here
router.patch('/read-all', verifyToken, markNotificationsAsRead);
router.get('/', verifyToken, getUserNotifications);

export default router;