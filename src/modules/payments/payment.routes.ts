import { FastifyInstance } from "fastify";
import { paymentController } from "./payment.controller";

export const paymentRoutes = async (app: FastifyInstance) => {
  await paymentController(app);
};
