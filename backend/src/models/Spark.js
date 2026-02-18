// models/Spark.js
import mongoose from 'mongoose';

const sparkSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      trim: true,
      maxlength: 280,
      default: "",
    },

    // ✅ Image array (filenames only)
    images: [{ type: String }], // Array for multiple images

    // Engagement
    // likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: { 
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: []  // ✅ Ensure default
    },

    // resparks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    resparks: { 
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: []  // ✅ Ensure default
    },


    commentsCount: { type: Number, default: 0 },

      // ✅ ADD THESE FIELDS FOR RESPARk
      isReSpark: {
        type: Boolean,
        default: false,
      },
      originalSpark: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Spark',
        default: null,
      },
      reSparkedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      reSparkComment: {
        type: String,
        maxlength: 280,
        default: '',
      },
    
    isDeleted: { type: Boolean, default: false },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },    // ← Add here
    toObject: { virtuals: true }   // ← Add here
  }
);

// Virtuals go HERE ↓↓↓ (after schema, before model)

sparkSchema.virtual('likesCount').get(function() {
  // return this.likes.length;
  return this.likes?.length || 0;  // ✅ Optional chaining
});

sparkSchema.virtual('resparksCount').get(function() {
  // return this.resparks.length;
  return this.resparks?.length || 0;  // ✅ Optional chaining
});

// Create model LAST
const Spark = mongoose.model('Spark', sparkSchema);

export default Spark;

