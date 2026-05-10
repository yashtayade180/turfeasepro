import { FastifyInstance } from "fastify";
import { ReviewService } from "./review.service";
import { jwtMiddleware } from "../auth/jwt.middleware";

const reviewService = new ReviewService();

export const reviewController = async (app: FastifyInstance) => {
  // Add review
  app.post(
    "/:turfId",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      try {
        const { rating, comment } = req.body;
        const review = await reviewService.addReview(req.user.id, req.params.turfId, rating, comment);
        reply.send(review);
      } catch (err: any) {
        reply.status(400).send({ message: err.message });
      }
    }
  );

  // Get all reviews for a turf
  app.get("/:turfId", async (req: any, reply) => {
    const reviews = await reviewService.getTurfReviews(req.params.turfId);
    reply.send(reviews);
  });

  // Get reviews by logged-in user
  app.get(
    "/me/all",
    { preHandler: jwtMiddleware(["user"]) },
    async (req: any, reply) => {
      const reviews = await reviewService.getUserReviews(req.user.id);
      reply.send(reviews);
    }
  );
};
