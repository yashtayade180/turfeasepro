import { FastifyInstance } from "fastify";
import { PaymentService } from "./payment.service";
import { jwtMiddleware } from "../auth/jwt.middleware";

const paymentService = new PaymentService();

export const paymentController = async (app: FastifyInstance) => {
  // User: Make payment
  app.post(
    "/:bookingId",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      try {
        const payment = await paymentService.initiatePayment(req.user.id, req.params.bookingId);
        reply.send(payment);
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // User: My payments
  app.get(
    "/me",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      const payments = await paymentService.getUserPayments(req.user.id);
      reply.send(payments);
    }
  );

  // Admin: All payments
  app.get(
    "/",
    { preHandler: jwtMiddleware(["admin"]) },
    async (req: any, reply) => {
      const payments = await paymentService.getAllPayments();
      reply.send(payments);
    }
  );
};
