import { FastifyInstance } from "fastify";
import { BookingService } from "./booking.service";
import { verifyToken } from "../middleware/auth.middleware";

const bookingService = new BookingService();

export async function bookingRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", async (req, res) => {
    const user = await verifyToken(req, res);
    req.user = user; // attach user to request
  });

  fastify.post("/", async (req, res) => {
    const { turfId, startTime, endTime } = req.body as any;
    try {
      const booking = await bookingService.createBooking(req.user.id, turfId, new Date(startTime), new Date(endTime));
      return { message: "Booking created", booking };
    } catch (err: any) {
      const status = err.message === 'Slot already booked' ? 409 : 400;
      res.status(status).send({ message: err.message });
    }
  });

  fastify.get("/", async (req, res) => {
    const bookings = await bookingService.getUserBookings(req.user.id);
    return bookings;
  });

  fastify.post("/cancel/:id", async (req: any, res) => {
    try {
      const booking = await bookingService.cancelBooking(req.params.id, req.user.id);
      return { message: "Booking cancelled", booking };
    } catch (err: any) {
      res.status(400).send({ message: err.message });
    }
  });

  fastify.get("/turf/:turfId", async (req: any, res) => {
    const bookings = await bookingService.getAllBookingsForTurf(req.params.turfId);
    return bookings;
  });
}
