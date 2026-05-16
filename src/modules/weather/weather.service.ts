import axios from "axios";

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Icy fog",
  51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
  61: "Light rain", 63: "Moderate rain", 65: "Heavy rain",
  71: "Light snow", 73: "Moderate snow", 75: "Heavy snow",
  80: "Rain showers", 81: "Moderate showers", 82: "Violent showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Severe thunderstorm",
};

function weatherDescription(code: number): string {
  return WMO_DESCRIPTIONS[code] ?? "Unknown";
}

function isRainRisk(code: number, precipProbability: number): boolean {
  return precipProbability >= 60 || (code >= 51 && code <= 99);
}

export class WeatherService {
  async getForecast(lat: number, lng: number, date: string) {
    const url = "https://api.open-meteo.com/v1/forecast";
    const { data } = await axios.get(url, {
      params: {
        latitude: lat,
        longitude: lng,
        daily: [
          "weathercode",
          "precipitation_probability_max",
          "temperature_2m_max",
          "temperature_2m_min",
        ].join(","),
        timezone: "auto",
        start_date: date,
        end_date: date,
      },
    });

    const code: number = data.daily.weathercode[0];
    const precipProb: number = data.daily.precipitation_probability_max[0];
    const tempMax: number = data.daily.temperature_2m_max[0];
    const tempMin: number = data.daily.temperature_2m_min[0];

    return {
      date,
      weatherCode: code,
      description: weatherDescription(code),
      precipitationProbability: precipProb,
      tempMax,
      tempMin,
      rainRisk: isRainRisk(code, precipProb),
      alert:
        isRainRisk(code, precipProb)
          ? `Rain likely (${precipProb}% chance). Consider rescheduling.`
          : null,
    };
  }
}
