import { Official } from "./official.model";
import { BookingAddon } from "./booking-addon.model";
import { Booking } from "../booking/booking.model";

export class OfficialService {
  async listOfficials(filters: { sport?: string; role?: string }) {
    const query: any = { isAvailable: true };
    if (filters.sport) query.sports = { $in: [new RegExp(filters.sport, "i")] };
    if (filters.role) query.role = filters.role;
    return Official.find(query).populate("addedByPartner", "name").sort({ rating: -1 });
  }

  async getOfficial(id: string) {
    return Official.findById(id).populate("addedByPartner", "name");
  }

  async registerOfficial(
    partnerId: string,
    data: {
      name: string;
      role: "referee" | "coach";
      sports: string[];
      pricePerHour: number;
      bio?: string;
    }
  ) {
    return Official.create({ ...data, addedByPartner: partnerId });
  }

  async addToBooking(userId: string, bookingId: string, officialId: string) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.user.toString() !== userId) throw new Error("Not your booking");
    if (booking.status === "cancelled") throw new Error("Booking is cancelled");

    const existing = await BookingAddon.findOne({ booking: bookingId });
    if (existing) throw new Error("Booking already has an official assigned");

    const official = await Official.findById(officialId);
    if (!official) throw new Error("Official not found");
    if (!official.isAvailable) throw new Error("Official is not available");

    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    const hours = (end.getTime() - start.getTime()) / 3_600_000;
    const fee = Math.ceil(official.pricePerHour * hours);

    return BookingAddon.create({
      booking: bookingId,
      official: officialId,
      fee,
      requestedBy: userId,
    });
  }

  async getBookingAddon(bookingId: string) {
    return BookingAddon.findOne({ booking: bookingId }).populate("official");
  }

  async removeAddon(userId: string, bookingId: string) {
    const addon = await BookingAddon.findOne({ booking: bookingId });
    if (!addon) throw new Error("No addon found");
    if (addon.requestedBy.toString() !== userId) throw new Error("Not your booking");
    addon.status = "cancelled";
    await addon.save();
    return addon;
  }

  async getMyPartnerOfficials(partnerId: string) {
    return Official.find({ addedByPartner: partnerId });
  }
}
