import mongoose, { Schema, Document } from "mongoose";

export interface IBookingAddon extends Document {
  booking: mongoose.Types.ObjectId;
  official: mongoose.Types.ObjectId;
  fee: number;
  status: "pending" | "confirmed" | "cancelled";
  requestedBy: mongoose.Types.ObjectId;
}

const bookingAddonSchema = new Schema<IBookingAddon>(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true, unique: true },
    official: { type: Schema.Types.ObjectId, ref: "Official", required: true },
    fee: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const BookingAddon = mongoose.model<IBookingAddon>("BookingAddon", bookingAddonSchema);
