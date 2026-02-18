import express from 'express';
import { getUserVerdicts } from '../controllers/verdictsController.js';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get('/', verifyToken, getUserVerdicts);

export default router;
