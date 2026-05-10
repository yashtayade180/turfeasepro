import { FastifyInstance } from "fastify";
import { AdminService } from "./admin.service";
import { verifyToken } from "../middleware/auth.middleware";

const adminService = new AdminService();

export async function adminRoutes(fastify: FastifyInstance) {
  // Protect all routes with JWT + admin role
  fastify.addHook("preHandler", async (req, res) => {
    const user = await verifyToken(req, res);
    if (user.role !== "admin") {
      res.status(403).send({ message: "Forbidden: Admins only" });
    }
    req.user = user;
  });

  fastify.post("/admin/approve-turf/:id", async (req:any, res) => {
    const turf = await adminService.approveTurf(req.user.id, req.params.id);
    return { message: "Turf approved", turf };
  });

  fastify.post("/admin/reject-turf/:id", async (req:any, res) => {
    const { reason } = req.body as { reason?: string };
    const turf = await adminService.rejectTurf(req.user.id, req.params.id, reason);
    return { message: "Turf rejected", turf };
  });

  fastify.post("/admin/ban-user/:id", async (req:any, res) => {
    const { reason } = req.body as { reason?: string };
    const user = await adminService.banUser(req.user.id, req.params.id, reason);
    return { message: "User banned", user };
  });

  fastify.post("/admin/unban-user/:id", async (req:any, res) => {
    const user = await adminService.unbanUser(req.user.id, req.params.id);
    return { message: "User unbanned", user };
  });

  fastify.get("/admin/bookings", async () => {
    return adminService.getAllBookings();
  });

  fastify.get("/admin/revenue-summary", async () => {
    return adminService.getRevenueSummary();
  });
}
