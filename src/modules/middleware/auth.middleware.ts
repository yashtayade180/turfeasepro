import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { User } from "../auth/user.model";
import env from "../../config/env"; // contains JWT_SECRET

// Extend FastifyRequest to include "user"
declare module "fastify" {
  interface FastifyRequest {
    user?: any;
  }
}

export async function verifyToken(req: FastifyRequest, res: FastifyReply) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(401).send({ message: "Authorization header missing" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).send({ message: "Token missing" });
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      res.status(401).send({ message: "Invalid or inactive user" });
      return;
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    return req.user;
  } catch (err) {
    res.status(401).send({ message: "Unauthorized", error: (err as Error).message });
  }
}
