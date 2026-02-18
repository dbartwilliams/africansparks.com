// models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  spark: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spark',
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 280,
    trim: true,
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  likesCount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

commentSchema.index({ spark: 1, createdAt: -1 });

// ✅ DEFAULT export (not named)
const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
