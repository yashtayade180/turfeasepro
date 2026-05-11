import { Turf } from "../turf/model";
import { User } from "../auth/user.model";
import { Booking } from "../booking/booking.model";
import { AdminAction } from "./admin.model";

export class AdminService {
  async approveTurf(adminId: string, turfId: string) {
    const turf = await Turf.findByIdAndUpdate(turfId, { approved: true }, { new: true });
    if (!turf) throw new Error("Turf not found");

    await AdminAction.create({
      adminId,
      actionType: "APPROVE_TURF",
      targetId: turfId,
    });

    return turf;
  }

  async rejectTurf(adminId: string, turfId: string, reason?: string) {
    const turf = await Turf.findByIdAndUpdate(turfId, { approved: false }, { new: true });
    if (!turf) throw new Error("Turf not found");

    await AdminAction.create({
      adminId,
      actionType: "REJECT_TURF",
      targetId: turfId,
      reason,
    });

    return turf;
  }

  async banUser(adminId: string, userId: string, reason?: string) {
    const user = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
    if (!user) throw new Error("User not found");

    await AdminAction.create({
      adminId,
      actionType: "BAN_USER",
      targetId: userId,
      reason,
    });

    return user;
  }

  async unbanUser(adminId: string, userId: string) {
    const user = await User.findByIdAndUpdate(userId, { isActive: true }, { new: true });
    if (!user) throw new Error("User not found");

    await AdminAction.create({
      adminId,
      actionType: "UNBAN_USER",
      targetId: userId,
    });

    return user;
  }

  async getAllBookings() {
    return Booking.find().populate("user", "name email").populate("turf", "name address");
  }

  async getRevenueSummary() {
    const bookings = await Booking.find({ status: "confirmed" }); 
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    return {
      totalBookings: bookings.length,
      totalRevenue,
    };
  }
}
