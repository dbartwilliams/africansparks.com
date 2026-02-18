import express from 'express';
import multer from "multer";
import { 
    getUserById,
    toggleConnect,
    getLatestUsers,
    updateUser,
    getUserSparks
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ SPECIFIC routes first
router.get('/:id/sparks', verifyToken, getUserSparks);
router.get('/latest', verifyToken, getLatestUsers);        // /users/latest
router.get('/:id', verifyToken, getUserById);            // /users/:id
router.post('/:id/connect', verifyToken, toggleConnect);  // /users/:id/connect
router.patch('/me', verifyToken, upload.single('avatar'), updateUser);

export default router;
