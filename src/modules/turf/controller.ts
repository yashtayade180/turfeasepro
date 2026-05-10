import { FastifyInstance } from "fastify";
import { TurfService } from "./service";
import { jwtMiddleware } from "../auth/jwt.middleware";

const turfService = new TurfService();

export const turfController = async (app: FastifyInstance) => {
  // Partner: Create turf
  app.post(
    "/",
    { preHandler: jwtMiddleware(["partner"]) },
    async (req: any, reply) => {
      try {
        const { name, address, pricePerHour, lat, lng } = req.body;
        const turf = await turfService.createTurf(
          {
            name,
            address,
            pricePerHour,
            location: { type: "Point", coordinates: [lng, lat] },
          },
          req.user.id
        );
        reply.send(turf);
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // User: List turfs
  app.get("/", async (_, reply) => {
    const turfs = await turfService.getTurfs();
    reply.send(turfs);
  });

  // User: Search nearby turfs
  app.get("/search", async (req, reply) => {
    try {
      const { lat, lng, radius } = req.query as any;
      const turfs = await turfService.searchNearby(
        parseFloat(lat),
        parseFloat(lng),
        parseFloat(radius || "5")
      );
      reply.send(turfs);
    } catch (err: any) {
      reply.status(400).send({ message: err.message });
    }
  });

  // Admin: Approve turf
  app.patch(
    "/:id/approve",
    { preHandler: jwtMiddleware(["admin"]) },
    async (req: any, reply) => {
      try {
        const turf = await turfService.approveTurf(req.params.id);
        reply.send(turf);
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // Get turf by ID
  app.get("/:id", async (req: any, reply) => {
    const turf = await turfService.getById(req.params.id);
    if (!turf) return reply.status(404).send({ message: "Turf not found" });
    reply.send(turf);
  });
};
