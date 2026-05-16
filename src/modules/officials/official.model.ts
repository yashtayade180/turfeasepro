import mongoose, { Schema, Document } from "mongoose";

export interface IOfficial extends Document {
  name: string;
  role: "referee" | "coach";
  sports: string[];
  pricePerHour: number;
  bio: string;
  rating: number;
  ratingCount: number;
  isAvailable: boolean;
  addedByPartner: mongoose.Types.ObjectId;
}

const officialSchema = new Schema<IOfficial>(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ["referee", "coach"], required: true },
    sports: { type: [String], required: true },
    pricePerHour: { type: Number, required: true },
    bio: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    addedByPartner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Official = mongoose.model<IOfficial>("Official", officialSchema);
