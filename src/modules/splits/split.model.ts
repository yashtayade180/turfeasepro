import mongoose, { Schema, Document } from "mongoose";
import crypto from "crypto";

export interface ISlot {
  token: string;
  status: "pending" | "paid";
  paidBy?: mongoose.Types.ObjectId;
  payerName?: string;
  paidAt?: Date;
  transactionId?: string;
}

export interface ISplitPayment extends Document {
  booking: mongoose.Types.ObjectId;
  totalAmount: number;
  splitCount: number;
  perPersonAmount: number;
  slots: ISlot[];
  initiatedBy: mongoose.Types.ObjectId;
  status: "pending" | "partial" | "complete";
}

const slotSchema = new Schema<ISlot>({
  token: { type: String, default: () => crypto.randomBytes(10).toString("hex") },
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
  paidBy: { type: Schema.Types.ObjectId, ref: "User" },
  payerName: { type: String },
  paidAt: { type: Date },
  transactionId: { type: String },
});

const splitSchema = new Schema<ISplitPayment>(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    totalAmount: { type: Number, required: true },
    splitCount: { type: Number, required: true },
    perPersonAmount: { type: Number, required: true },
    slots: { type: [slotSchema], default: [] },
    initiatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "partial", "complete"], default: "pending" },
  },
  { timestamps: true }
);

export const SplitPayment = mongoose.model<ISplitPayment>("SplitPayment", splitSchema);
