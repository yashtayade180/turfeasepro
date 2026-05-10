import { FastifyInstance } from "fastify";
import { BookingService } from "./booking.service";
import { verifyToken } from "../middleware/auth.middleware";

const bookingService = new BookingService();

export async function bookingRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", async (req, res) => {
    const user = await verifyToken(req, res);
    req.user = user; // attach user to request
  });

  fastify.post("/bookings", async (req, res) => {
    const { turfId, startTime, endTime } = req.body as any;
    const booking = await bookingService.createBooking(req.user.id, turfId, new Date(startTime), new Date(endTime));
    return { message: "Booking created", booking };
  });

  fastify.get("/bookings", async (req, res) => {
    const bookings = await bookingService.getUserBookings(req.user.id);
    return bookings;
  });

  fastify.post("/bookings/cancel/:id", async (req:any, res) => {
    const booking = await bookingService.cancelBooking(req.params.id, req.user.id);
    return { message: "Booking cancelled", booking };
  });
}
