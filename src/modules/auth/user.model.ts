import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "partner" | "admin";
  isActive: boolean; // ✅ added
  comparePassword: (password: string) => Promise<boolean>;
}

export type UserDocument = IUser; // 👈 now you can import this anywhere

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "partner", "admin"], default: "user" },
  isActive: { type: Boolean, default: true }, // ✅ added
});

// hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare password
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
