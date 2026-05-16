import { api } from './api';

export interface HourlyWeather {
  hour: number;
  precipitationProbability: number;
  weatherCode: number;
  description: string;
  rainRisk: boolean;
}

export interface WeatherForecast {
  date: string;
  weatherCode: number;
  description: string;
  precipitationProbability: number;
  tempMax: number;
  tempMin: number;
  rainRisk: boolean;
  alert: string | null;
  hourly: HourlyWeather[];
}

export const weatherApi = {
  getForecast: (lat: number, lng: number, date: string) =>
    api.get<WeatherForecast>('/weather', { params: { lat, lng, date } }).then(r => r.data),
};
