import { FastifyInstance } from "fastify";
import { BookingService } from "./booking.service";
import { jwtMiddleware } from "../auth/jwt.middleware";

const bookingService = new BookingService();

export const bookingController = async (app: FastifyInstance) => {
  // User: Create booking
  app.post(
    "/",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      try {
        const { turfId, startTime, endTime } = req.body;
        const booking = await bookingService.createBooking(
          req.user.id,
          turfId,
          new Date(startTime),
          new Date(endTime)
        );
        reply.send(booking);
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // User: My bookings
  app.get(
    "/me",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      const bookings = await bookingService.getUserBookings(req.user.id);
      reply.send(bookings);
    }
  );

  // User: Cancel booking
  app.patch(
    "/:id/cancel",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      try {
        const booking = await bookingService.cancelBooking(req.params.id, req.user.id);
        reply.send(booking);
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // Partner/Admin: Get all bookings for turf
  app.get(
    "/turf/:id",
    { preHandler: jwtMiddleware(["partner", "admin"]) },
    async (req: any, reply) => {
      const bookings = await bookingService.getAllBookingsForTurf(req.params.id);
      reply.send(bookings);
    }
  );
};
