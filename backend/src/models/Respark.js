// models/Respark.js
import mongoose from 'mongoose';

const resparkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  spark: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spark',
    required: true,
  },
}, { timestamps: true });

resparkSchema.index({ user: 1, spark: 1 }, { unique: true });

const Respark = mongoose.model('Respark', resparkSchema);
export default Respark;