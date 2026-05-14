import crypto from "crypto";
import { SplitPayment } from "./split.model";
import { Booking } from "../booking/booking.model";

export class SplitService {
  async createSplit(userId: string, bookingId: string, splitCount: number) {
    if (splitCount < 2 || splitCount > 10) throw new Error("Split count must be between 2 and 10");

    const booking = await Booking.findById(bookingId).populate("turf", "name address");
    if (!booking) throw new Error("Booking not found");
    if (booking.user.toString() !== userId) throw new Error("Not your booking");
    if (booking.status === "cancelled") throw new Error("Cannot split a cancelled booking");

    const existing = await SplitPayment.findOne({ booking: bookingId });
    if (existing) throw new Error("Split already exists for this booking");

    const perPersonAmount = Math.ceil(booking.totalPrice / splitCount);

    const slots = Array.from({ length: splitCount }, () => ({
      token: crypto.randomBytes(10).toString("hex"),
      status: "pending" as const,
    }));

    const split = await SplitPayment.create({
      booking: bookingId,
      totalAmount: booking.totalPrice,
      splitCount,
      perPersonAmount,
      slots,
      initiatedBy: userId,
      status: "pending",
    });

    return await split.populate("booking", "startTime endTime totalPrice turf");
  }

  async getSplit(splitId: string) {
    return await SplitPayment.findById(splitId)
      .populate({
        path: "booking",
        populate: { path: "turf", select: "name address images" },
      })
      .populate("initiatedBy", "name");
  }

  async getSplitByBooking(bookingId: string) {
    return await SplitPayment.findOne({ booking: bookingId })
      .populate({
        path: "booking",
        populate: { path: "turf", select: "name address images" },
      });
  }

  async paySlot(splitId: string, token: string, userId: string, payerName: string) {
    const split = await SplitPayment.findById(splitId);
    if (!split) throw new Error("Split not found");

    const slot = split.slots.find((s) => s.token === token);
    if (!slot) throw new Error("Invalid payment link");
    if (slot.status === "paid") throw new Error("This slot is already paid");

    // Check user hasn't already paid another slot
    const alreadyPaid = split.slots.find((s) => s.paidBy?.toString() === userId && s.status === "paid");
    if (alreadyPaid) throw new Error("You have already paid your share");

    slot.status = "paid";
    slot.paidBy = userId as unknown as typeof slot.paidBy;
    slot.payerName = payerName;
    slot.paidAt = new Date();
    slot.transactionId = crypto.randomBytes(8).toString("hex").toUpperCase();

    const paidCount = split.slots.filter((s) => s.status === "paid").length;
    split.status = paidCount === split.splitCount ? "complete" : "partial";

    await split.save();
    return split;
  }
}
