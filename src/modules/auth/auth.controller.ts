import { FastifyInstance } from "fastify";
import { AuthService } from "./auth.service";
import { jwtMiddleware } from "./jwt.middleware";

const authService = new AuthService();

export const authController = async (app: FastifyInstance) => {
  app.post("/register", async (req, reply) => {
    try {
      const { name, email, password, role } = req.body as any;
      const result = await authService.register({ name, email, password, role });
      reply.send(result);
    } catch (err: any) {
      reply.status(400).send({ message: err.message });
    }
  });

  app.post("/login", async (req, reply) => {
    try {
      const { email, password } = req.body as any;
      const result = await authService.login(email, password);
      reply.send(result);
    } catch (err: any) {
      reply.status(400).send({ message: err.message });
    }
  });

  app.get("/me", { preHandler: jwtMiddleware() }, async (req: any, reply) => {
    reply.send({ user: req.user });
  });
};
