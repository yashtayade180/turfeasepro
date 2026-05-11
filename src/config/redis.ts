import { createClient } from "redis";
import env from "./env";

let redisClient: any;

export const connectRedis = async () => {
  if (!env.REDIS_URL) {
    console.log("⚠️  REDIS_URL not set — skipping Redis connection");
    return;
  }

  redisClient = createClient({ url: env.REDIS_URL });

  redisClient.on("error", (err: any) =>
    console.error("❌ Redis connection error:", err)
  );

  await redisClient.connect();
  console.log("✅ Redis connected");

  return redisClient;
};

export const getRedisClient = () => redisClient;
