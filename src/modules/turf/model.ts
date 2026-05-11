import mongoose, { Schema, Document } from "mongoose";

export interface ITurf extends Document {
  name: string;
  location: { type: "Point"; coordinates: [number, number] };
  address: string;
  pricePerHour: number;
  owner: mongoose.Types.ObjectId;
  approved: boolean;
  rating: number;
  ratingCount: number;
  sports: string[];
  amenities: string[];
  description: string;
  images: string[];
  surfaceType: string;
}

const turfSchema = new Schema<ITurf>(
  {
    name: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approved: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    sports: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    surfaceType: { type: String, default: "Natural Grass" },
  },
  { timestamps: true }
);

turfSchema.index({ location: "2dsphere" });

export const Turf = mongoose.model<ITurf>("Turf", turfSchema);
