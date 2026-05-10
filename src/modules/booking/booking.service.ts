import { Booking } from "./booking.model";
import { Turf } from "../turf/model";

export class BookingService {
  async createBooking(userId: string, turfId: string, startTime: Date, endTime: Date) {
    const turf = await Turf.findById(turfId);
    if (!turf) throw new Error("Turf not found");
    if (!turf.approved) throw new Error("Turf not approved yet");

    const overlap = await Booking.findOne({
      turf: turfId,
      status: "confirmed",
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
    });
    if (overlap) throw new Error("Slot already booked");

    const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
    const totalPrice = hours * turf.pricePerHour;

    const booking = new Booking({
      turf: turfId,
      user: userId,
      startTime,
      endTime,
      totalPrice,
      status: "confirmed",
    });

    return await booking.save();
  }

  async getUserBookings(userId: string) {
    return await Booking.find({ user: userId })
      .populate("turf", "name address pricePerHour")
      .sort({ startTime: -1 });
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) throw new Error("Booking not found");
    if (booking.status === "cancelled") throw new Error("Already cancelled");

    booking.status = "cancelled";
    return await booking.save();
  }

  async getAllBookingsForTurf(turfId: string) {
    return await Booking.find({ turf: turfId, status: "confirmed" })
      .populate("user", "name email");
  }
}
