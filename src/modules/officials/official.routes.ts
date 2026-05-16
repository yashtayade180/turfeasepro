import { FastifyInstance } from "fastify";
import { OfficialService } from "./official.service";
import { jwtMiddleware } from "../auth/jwt.middleware";

const svc = new OfficialService();

export const officialRoutes = async (app: FastifyInstance) => {
  // List officials (public)
  app.get("/", async (req: any, reply) => {
    try {
      const { sport, role } = req.query as { sport?: string; role?: string };
      reply.send(await svc.listOfficials({ sport, role }));
    } catch (err: any) {
      reply.status(400).send({ message: err.message });
    }
  });

  // Register official (partner only)
  app.post(
    "/",
    { preHandler: jwtMiddleware(["partner"]) },
    async (req: any, reply) => {
      try {
        const data = req.body as any;
        reply.send(await svc.registerOfficial(req.user.id, data));
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // My registered officials (partner)
  app.get(
    "/mine",
    { preHandler: jwtMiddleware(["partner"]) },
    async (req: any, reply) => {
      try {
        reply.send(await svc.getMyPartnerOfficials(req.user.id));
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // Add official to a booking
  app.post(
    "/booking/:bookingId",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      try {
        const { officialId } = req.body as { officialId: string };
        reply.send(
          await svc.addToBooking(req.user.id, req.params.bookingId, officialId)
        );
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // Get addon for a booking
  app.get(
    "/booking/:bookingId",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      try {
        reply.send(await svc.getBookingAddon(req.params.bookingId));
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // Remove addon from a booking
  app.delete(
    "/booking/:bookingId",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      try {
        reply.send(await svc.removeAddon(req.user.id, req.params.bookingId));
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // Single official detail (public)
  app.get("/:id", async (req: any, reply) => {
    try {
      const official = await svc.getOfficial(req.params.id);
      if (!official) return reply.status(404).send({ message: "Not found" });
      reply.send(official);
    } catch (err: any) {
      reply.status(400).send({ message: err.message });
    }
  });
};
