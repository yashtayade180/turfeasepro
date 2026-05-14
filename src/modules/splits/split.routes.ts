import { FastifyInstance } from "fastify";
import { SplitService } from "./split.service";
import { jwtMiddleware } from "../auth/jwt.middleware";

const splitService = new SplitService();

export const splitRoutes = async (app: FastifyInstance) => {
  // Create split for a booking
  app.post(
    "/",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      try {
        const { bookingId, splitCount } = req.body as { bookingId: string; splitCount: number };
        const split = await splitService.createSplit(req.user.id, bookingId, splitCount);
        reply.send(split);
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // Get all splits initiated by the current user
  app.get(
    "/my",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      try {
        const splits = await splitService.getMySplits(req.user.id);
        reply.send(splits);
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // Get split by ID (public — for shareable page)
  app.get("/:splitId", async (req: any, reply) => {
    try {
      const split = await splitService.getSplit(req.params.splitId);
      if (!split) return reply.status(404).send({ message: "Split not found" });
      reply.send(split);
    } catch (err: any) {
      reply.status(400).send({ message: err.message });
    }
  });

  // Get split by booking ID
  app.get(
    "/booking/:bookingId",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      try {
        const split = await splitService.getSplitByBooking(req.params.bookingId);
        reply.send(split);
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // Pay a slot
  app.post(
    "/:splitId/pay/:token",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      try {
        const { name } = req.body as { name?: string };
        const split = await splitService.paySlot(
          req.params.splitId,
          req.params.token,
          req.user.id,
          name || req.user.name || "Player"
        );
        reply.send(split);
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );
};
