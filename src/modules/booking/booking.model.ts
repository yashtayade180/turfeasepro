import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  turf: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
}

const bookingSchema = new Schema<IBooking>(
  {
    turf: { type: Schema.Types.ObjectId, ref: "Turf", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
