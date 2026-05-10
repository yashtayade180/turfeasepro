import { User } from "../auth/user.model";
import { Booking } from "../booking/booking.model";

export class UserService {
  async getProfile(userId: string) {
    const user = await User.findById(userId).select("-password"); // exclude password
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateProfile(userId: string, updates: Partial<{ name: string; email: string; password: string }>) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;

    // For password change you’d hash it here
    if (updates.password) {
      // hash with bcrypt
      const bcrypt = require("bcryptjs");
      user.password = await bcrypt.hash(updates.password, 10);
    }

    await user.save();
    return user;
  }

  async getBookingHistory(userId: string) {
    return await Booking.find({ user: userId })
      .populate("turf", "name location")
      .sort({ createdAt: -1 });
  }
}
