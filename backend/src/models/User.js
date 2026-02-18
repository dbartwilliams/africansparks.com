import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 24,
      unique: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
      lowercase: true,
      trim: true,
    },
    userAvatar: { 
      type: String, 
      default: "user_avatar2.png" 
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    
    // Profile info
    bio: {
      type: String,
      maxlength: 160,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      maxlength: 30,
      default: "",
      trim: true,
    },
    website: {
      type: String,
      maxlength: 100,
      default: "",
      trim: true,
    },
    coverPhoto: {
      type: String,
      default: "default_cover.jpeg",
    },
    
    // Following system
    connectings: [{    // You follow them (following)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    }],
    connections: [{  // They follow you (followers)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    }],
    
    // Engagement stats - INSIDE schema
    stats: {
      sparksCount: { type: Number, default: 0 },
      likesCount: { type: Number, default: 0 },
      // connectingsCount: { type: Number, default: 0 },
      // connectionsCount: { type: Number, default: 0 },
    },
    
    // Bookmarks
    bookmarks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Spark",
      default: [],
    }],
    
    // Verification
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    isVerified: {
      type: Boolean,
      default: false,
    },
    
    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate - OUTSIDE schema but BEFORE model creation
userSchema.virtual('sparks', {
  ref: 'Spark',
  localField: '_id',
  foreignField: 'author',
  options: { sort: { createdAt: -1 } }
});

// Index for search
userSchema.index({ userName: 'text', firstName: 'text', lastName: 'text' });

// Method to get public profile
userSchema.methods.toPublicProfile = function() {
  return {
    _id: this._id,
    userName: this.userName,
    firstName: this.firstName,
    lastName: this.lastName,
    userAvatar: this.userAvatar,
    coverPhoto: this.coverPhoto,
    bio: this.bio,
    location: this.location,
    website: this.website,
    isVerified: this.isVerified,
    stats: this.stats,
    createdAt: this.createdAt,
  };
};

// Create and export model
export const User = mongoose.model("User", userSchema);

