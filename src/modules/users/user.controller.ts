import { FastifyInstance } from "fastify";
import { jwtMiddleware } from "../auth/jwt.middleware";
import { UserService } from "./user.service";

const userService = new UserService();

export const userController = async (app: FastifyInstance) => {
  // Get user profile
  app.get(
    "/me",
    { preHandler: jwtMiddleware(["user", "partner"]) },
    async (req: any, reply) => {
      try {
        const profile = await userService.getProfile(req.user.id);
        reply.send(profile);
      } catch (err: any) {
        reply.status(404).send({ message: err.message });
      }
    }
  );

  // Update profile
  app.put(
    "/me",
    { preHandler: jwtMiddleware(["user", "partner"]) },
    async (req: any, reply) => {
      try {
        const updated = await userService.updateProfile(req.user.id, req.body);
        reply.send(updated);
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // Get booking history
  app.get(
    "/me/bookings",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      const bookings = await userService.getBookingHistory(req.user.id);
      reply.send(bookings);
    }
  );
};
