
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRouters from "./routes/authRoutes.js";
import sparkRouters from "./routes/sparkRoutes.js";
import commentRouters from "./routes/commentRoutes.js";
// import verdictsRoutes from './routes/verdictsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6600;

// Middleware
app.use(cors({
  origin: "http://localhost:6610",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRouters);
app.use('/api/sparks', sparkRouters);
app.use('/api/comments', commentRouters);
// app.use('/api/verdicts', verdictsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// 🚨 FIX: connect DB FIRST, then listen
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 social media backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
