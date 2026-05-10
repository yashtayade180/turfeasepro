import { FastifyInstance } from "fastify";
import { reviewController } from "./review.controller";

export const reviewRoutes = async (app: FastifyInstance) => {
  await reviewController(app);
};
