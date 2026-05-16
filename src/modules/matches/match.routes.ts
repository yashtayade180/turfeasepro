import { FastifyInstance } from "fastify";
import { MatchService } from "./match.service";
import { jwtMiddleware } from "../auth/jwt.middleware";

const svc = new MatchService();

export const matchRoutes = async (app: FastifyInstance) => {
  // Log a match result
  app.post(
    "/",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      try {
        const { bookingId, teamAName, teamBName, scoreA, scoreB, players } =
          req.body as any;
        const match = await svc.logMatch(req.user.id, bookingId, {
          teamAName,
          teamBName,
          scoreA,
          scoreB,
          players,
        });
        reply.send(match);
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // My match history + stats
  app.get(
    "/my",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      try {
        reply.send(await svc.getMyMatches(req.user.id));
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // Turf leaderboard
  app.get("/turf/:turfId/leaderboard", async (req: any, reply) => {
    try {
      reply.send(await svc.getTurfLeaderboard(req.params.turfId));
    } catch (err: any) {
      reply.status(400).send({ message: err.message });
    }
  });

  // Single match detail
  app.get("/:matchId", async (req: any, reply) => {
    try {
      const match = await svc.getMatchById(req.params.matchId);
      if (!match) return reply.status(404).send({ message: "Match not found" });
      reply.send(match);
    } catch (err: any) {
      reply.status(400).send({ message: err.message });
    }
  });
};
