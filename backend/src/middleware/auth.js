// middleware/auth.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ Set req.user (not req.userId)
    req.user = { id: verified.userId };
    
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
