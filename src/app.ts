import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { turfRoutes } from "./modules/turf/routes";
import { bookingRoutes } from "./modules/booking/booking.routes";
import { paymentRoutes } from "./modules/payments/payment.routes";
import { reviewRoutes } from "./modules/reviews/review.routes";
import { userRoutes } from "./modules/users/user.routes";
import { authController } from "./modules/auth/auth.controller";
import { adminRoutes } from "./modules/admin/admin.controller";

const buildApp = () => {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: "*" });
  app.register(helmet);

  app.register(authController, { prefix: "/api/auth" }); // 👈 fix
  app.register(turfRoutes, { prefix: "/api/turfs" });
  app.register(bookingRoutes, { prefix: "/api/bookings" });
  app.register(paymentRoutes, { prefix: "/api/payments" });
  app.register(reviewRoutes, { prefix: "/api/reviews" });
  app.register(userRoutes, { prefix: "/api/users" });
  app.register(adminRoutes, { prefix: "/api" });

  return app;
};

export default buildApp;
