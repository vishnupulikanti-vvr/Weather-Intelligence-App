export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  country_code: string;
  timezone: string;
  population?: number;
}

export interface CurrentWeather {
  temperature: number;
  relativeHumidity: number;
  apparentTemperature: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  time: string;
}

export interface HourlyForecast {
  time: string[];
  temperature2m: number[];
  precipitationProbability: number[];
  weatherCode: number[];
}

export interface DailyForecast {
  time: string[];
  weatherCode: number[];
  temperature2mMax: number[];
  temperature2mMin: number[];
  apparentTemperatureMax: number[];
  apparentTemperatureMin: number[];
  uvIndexMax: number[];
  precipitationSum: number[];
  precipitationProbabilityMax: number[];
  windSpeed10mMax: number[];
}

export interface WeatherData {
  city: City;
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
  timezone: string;
  timezoneAbbreviation: string;
  elevation: number;
}

export type TempUnit = "celsius" | "fahrenheit";
export type WindUnit = "kmh" | "mph" | "ms";

export interface WeatherCondition {
  label: string;
  icon: string; // Lucide icon name or emoji
  gradient: string; // Tailwind background gradient classes
  color: string; // Tailwind text color
}

export interface IntelligenceRecommendation {
  type: "warning" | "info" | "success" | "neutral";
  title: string;
  message: string;
  iconName: string;
}
