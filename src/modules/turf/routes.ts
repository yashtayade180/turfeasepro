import { FastifyInstance } from "fastify";
import { turfController } from "../turf/controller";

export const turfRoutes = async (app: FastifyInstance) => {
  await turfController(app);
};
