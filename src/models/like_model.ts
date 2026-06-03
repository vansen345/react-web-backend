import mongoose, { Schema } from "mongoose";

// LikeModel.ts
const likeSchema = new Schema({
    PP300: { type: Number, required: true },
    FO100: { type: Number, required: true },
}, { timestamps: true });

likeSchema.index({ PP300: 1, FO100: 1 }, { unique: true });

export const LikeModel = mongoose.model('Like', likeSchema);