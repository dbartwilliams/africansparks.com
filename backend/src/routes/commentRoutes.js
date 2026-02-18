
import express from "express";
import multer from "multer";
import { 
    getAllComments,
    createComment,
    deleteComment,
    getCommentsBySparkId
} from "../controllers/commentController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });


/* READ */
router.get("/spark/:sparkId", verifyToken, getAllComments);


/* READ COMMEMT BY SPARKS */
router.get("/:sparkId/comments", verifyToken, getCommentsBySparkId);

/* CREATE */
router.post("/", verifyToken, createComment);

// DELETE
router.delete("/:id", verifyToken, deleteComment);



export default router;



