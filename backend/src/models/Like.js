// models/Like.js
import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetType: {
      type: String,
      enum: ['Spark', 'Comment'],  // Changed from Tweet to Spark
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'targetType',
    },
  },
  { timestamps: true }
);

// One like per user per target
likeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);
export default Like;
// import mongoose from 'mongoose';

// const likeSchema = new mongoose.Schema(
//   {
//     // Who liked
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },

//     // What they liked (polymorphic - can like tweets or comments)
//     targetType: {
//       type: String,
//       enum: ['Tweet', 'Comment'],
//       required: true,
//     },

//     targetId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       refPath: 'targetType',
//     },
//   },
//   { timestamps: true }
// );

// // Compound index: one like per user per target
// likeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

// const Like = mongoose.model('Like', likeSchema);
// export default Like;