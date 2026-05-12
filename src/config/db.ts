import mongoose from "mongoose";
import env from "./env";

function buildMongoUri(): string {
  if (env.MONGO_USER && env.MONGO_PASS && env.MONGO_HOST) {
    const pass = encodeURIComponent(env.MONGO_PASS);
    return `mongodb+srv://${env.MONGO_USER}:${pass}@${env.MONGO_HOST}/${env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`;
  }
  if (env.MONGO_URI) return env.MONGO_URI;
  throw new Error("No MongoDB connection configured. Set MONGO_USER/MONGO_PASS/MONGO_HOST or MONGO_URI.");
}

export const connectDB = async () => {
  const uri = buildMongoUri();
  console.log("🔍 Connecting to host:", uri.replace(/:\/\/[^@]+@/, '://***@').split('/')[2]);
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
