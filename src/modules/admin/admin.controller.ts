import { FastifyInstance } from "fastify";
import { AdminService } from "./admin.service";
import { verifyToken } from "../middleware/auth.middleware";
import { Turf } from "../turf/model";
import { Booking } from "../booking/booking.model";

const adminService = new AdminService();

// Import User model
import mongoose from "mongoose";
const User = mongoose.model("User");

export async function adminRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", async (req, res) => {
    const user = await verifyToken(req, res);
    if (user.role !== "admin") {
      res.status(403).send({ message: "Forbidden: Admins only" });
    }
    (req as any).user = user;
  });

  // Stats overview
  fastify.get("/admin/stats", async () => {
    const [totalUsers, activeTurfs, pendingApprovals, totalBookings] = await Promise.all([
      User.countDocuments(),
      Turf.countDocuments({ approved: true }),
      Turf.countDocuments({ approved: false }),
      Booking.countDocuments(),
    ]);
    return { totalUsers, activeTurfs, pendingApprovals, totalBookings };
  });

  // All users
  fastify.get("/admin/users", async () => {
    return User.find().select("-password").sort({ createdAt: -1 });
  });

  // All turfs including unapproved
  fastify.get("/admin/turfs", async (req: any) => {
    const { approved } = req.query as any;
    const filter = approved !== undefined ? { approved: approved === "true" } : {};
    return Turf.find(filter).populate("owner", "name email").sort({ createdAt: -1 });
  });

  fastify.post("/admin/approve-turf/:id", async (req: any, res) => {
    const turf = await adminService.approveTurf(req.user.id, req.params.id);
    return { message: "Turf approved", turf };
  });

  fastify.post("/admin/reject-turf/:id", async (req: any, res) => {
    const { reason } = req.body as { reason?: string };
    const turf = await adminService.rejectTurf(req.user.id, req.params.id, reason);
    return { message: "Turf rejected", turf };
  });

  fastify.post("/admin/ban-user/:id", async (req: any, res) => {
    const { reason } = req.body as { reason?: string };
    const user = await adminService.banUser(req.user.id, req.params.id, reason);
    return { message: "User banned", user };
  });

  fastify.post("/admin/unban-user/:id", async (req: any, res) => {
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
