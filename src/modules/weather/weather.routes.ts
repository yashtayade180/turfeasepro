import { FastifyInstance } from "fastify";
import { WeatherService } from "./weather.service";

const svc = new WeatherService();

export const weatherRoutes = async (app: FastifyInstance) => {
  // GET /api/weather?lat=X&lng=Y&date=YYYY-MM-DD
  app.get("/", async (req: any, reply) => {
    try {
      const { lat, lng, date } = req.query as {
        lat?: string;
        lng?: string;
        date?: string;
      };

      if (!lat || !lng || !date) {
        return reply
          .status(400)
          .send({ message: "lat, lng and date are required" });
      }

      const forecast = await svc.getForecast(
        parseFloat(lat),
        parseFloat(lng),
        date
      );
      reply.send(forecast);
    } catch (err: any) {
      reply.status(500).send({ message: "Weather fetch failed", error: err.message });
    }
  });
};
