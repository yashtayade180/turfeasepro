import { FastifyInstance } from "fastify";
import { userController } from "./user.controller";

export const userRoutes = async (app: FastifyInstance) => {
  await userController(app);
};
