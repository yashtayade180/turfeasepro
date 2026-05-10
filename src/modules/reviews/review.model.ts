import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  turf: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
}

const reviewSchema = new Schema<IReview>(
  {
    turf: { type: Schema.Types.ObjectId, ref: "Turf", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

reviewSchema.index({ turf: 1, user: 1 }, { unique: true }); // prevent multiple reviews per turf

export const Review = mongoose.model<IReview>("Review", reviewSchema);
