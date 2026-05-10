import { User, UserDocument } from "./user.model";
import jwt from "jsonwebtoken";
import env from "../../config/env";

export class AuthService {
  async register(data: { name: string; email: string; password: string; role?: string }) {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error("Email already registered");
    const user = new User(data);
    await user.save();
    return this.generateToken(user);
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    console.log("User from DB:", user);
  
    if (!user) throw new Error("Invalid credentials");
  
    console.log("Has comparePassword?", typeof (user as any).comparePassword);
    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");
    return this.generateToken(user);
  }

  generateToken(user: UserDocument) {
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
    return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
  }
}
