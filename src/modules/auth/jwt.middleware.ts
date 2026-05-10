import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import env from "../../config/env";

export const jwtMiddleware = (roles?: string[]) => {
  return async (req: any, reply: FastifyReply) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) throw new Error("Missing Authorization header");
      const token = authHeader.split(" ")[1];
      const decoded: any = jwt.verify(token, env.JWT_SECRET);

      req.user = decoded; // attach user to request

      if (roles && !roles.includes(decoded.role)) {
        return reply.status(403).send({ message: "Forbidden: Insufficient role" });
      }
    } catch (err: any) {
      return reply.status(401).send({ message: "Unauthorized", error: err.message });
    }
  };
};
