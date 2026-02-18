import express from "express";
import multer from "multer";
import { 
    createSpark,
    getAllSparks,  
    getSparkById, 
    deleteSpark, 
    toggleLike, 
    toggleRespark,
    getConnectingSparks
} from "../controllers/SparkController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/* SPECIFIC ROUTES FIRST */
router.get('/connecting', verifyToken, getConnectingSparks);  // ✅ Move to top

/* READ ALL */
router.get("/", verifyToken, getAllSparks);

/* CREATE */
router.post("/", verifyToken, upload.array("images", 2), createSpark);

/* LIKE / UNLIKE */
router.post('/:sparkId/like', verifyToken, toggleLike);

/* ReSpark / UNReSpark */
router.post("/:id/respark", verifyToken, toggleRespark);

/* DELETE */
router.delete("/:id", verifyToken, deleteSpark);

/* READ SINGLE - MUST BE LAST */
router.get("/:sparkId", verifyToken, getSparkById);  // ✅ Move to bottom

export default router;