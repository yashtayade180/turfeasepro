import buildApp from "./app";
import env from "./config/env";
import { connectDB } from "./config/db";
import { connectRedis } from "./config/redis";

const startServer = async () => {
  const app = buildApp();

  await connectDB();
  await connectRedis();

  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
