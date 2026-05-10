import { Schema, model, Document } from "mongoose";

export interface IAdminAction extends Document {
  adminId: string; // Admin user ID
  actionType: "APPROVE_TURF" | "REJECT_TURF" | "BAN_USER" | "UNBAN_USER" | "DISPUTE";
  targetId: string; // Turf/User/Booking id
  reason?: string;
  createdAt: Date;
}

const AdminActionSchema = new Schema<IAdminAction>({
  adminId: { type: String, required: true },
  actionType: {
    type: String,
    enum: ["APPROVE_TURF", "REJECT_TURF", "BAN_USER", "UNBAN_USER", "DISPUTE"],
    required: true,
  },
  targetId: { type: String, required: true },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const AdminAction = model<IAdminAction>("AdminAction", AdminActionSchema);
