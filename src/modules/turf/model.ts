import mongoose, { Schema, Document } from "mongoose";

export interface ITurf extends Document {
  name: string;
  location: { type: "Point"; coordinates: [number, number] }; // GeoJSON
  address: string;
  pricePerHour: number;
  owner: mongoose.Types.ObjectId; // partner ID
  approved: boolean;
  rating: number;
  ratingCount: number
}

const turfSchema = new Schema<ITurf>(
  {
    name: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    address: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approved: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

turfSchema.index({ location: "2dsphere" }); // for geo search

export const Turf = mongoose.model<ITurf>("Turf", turfSchema);
