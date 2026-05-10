import { Payment } from "./payment.model";
import { Booking } from "../booking/booking.model";
import crypto from "crypto";

export class PaymentService {
  async initiatePayment(userId: string, bookingId: string) {
    const booking = await Booking.findById(bookingId).populate("turf");
    if (!booking) throw new Error("Booking not found");

    // Prevent duplicate payment
    const existing = await Payment.findOne({ booking: bookingId, status: "success" });
    if (existing) throw new Error("Booking already paid");

    // Mock transaction ID
    const transactionId = crypto.randomBytes(8).toString("hex");

    const payment = new Payment({
      booking: bookingId,
      user: userId,
      amount: booking.totalPrice,
      status: "success", // In real Razorpay/Stripe this starts as "pending"
      provider: "mock",
      transactionId,
    });

    await payment.save();
    return payment;
  }

  async getUserPayments(userId: string) {
    return await Payment.find({ user: userId })
      .populate("booking", "startTime endTime status")
      .sort({ createdAt: -1 });
  }

  async getAllPayments() {
    return await Payment.find()
      .populate("user", "name email")
      .populate("booking", "startTime endTime totalPrice");
  }
}
