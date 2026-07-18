import React from "react";
import { IntelligenceRecommendation } from "./types";

export interface WeatherConditionConfig {
  label: string;
  icon: string; // Lucide icon name
  gradient: string; // Tailwind background gradient for active card
  textColor: string;
  overlayClass: string;
}

export const WMO_CODE_MAP: Record<number, WeatherConditionConfig> = {
  0: {
    label: "Clear Sky",
    icon: "Sun",
    gradient: "from-amber-400 via-orange-400 to-amber-600",
    textColor: "text-amber-100",
    overlayClass: "bg-sunny",
  },
  1: {
    label: "Mainly Clear",
    icon: "SunDim",
    gradient: "from-sky-400 via-amber-200 to-sky-600",
    textColor: "text-sky-100",
    overlayClass: "bg-mainly-clear",
  },
  2: {
    label: "Partly Cloudy",
    icon: "CloudSun",
    gradient: "from-blue-500 via-indigo-400 to-slate-600",
    textColor: "text-indigo-100",
    overlayClass: "bg-partly-cloudy",
  },
  3: {
    label: "Overcast",
    icon: "Cloud",
    gradient: "from-slate-500 via-zinc-500 to-slate-700",
    textColor: "text-slate-100",
    overlayClass: "bg-overcast",
  },
  45: {
    label: "Foggy",
    icon: "CloudFog",
    gradient: "from-slate-600 via-zinc-600 to-stone-700",
    textColor: "text-stone-200",
    overlayClass: "bg-foggy",
  },
  48: {
    label: "Depositing Rime Fog",
    icon: "CloudFog",
    gradient: "from-slate-700 via-zinc-600 to-teal-800",
    textColor: "text-teal-100",
    overlayClass: "bg-foggy",
  },
  51: {
    label: "Light Drizzle",
    icon: "CloudDrizzle",
    gradient: "from-blue-400 via-slate-500 to-indigo-600",
    textColor: "text-blue-100",
    overlayClass: "bg-drizzle",
  },
  53: {
    label: "Moderate Drizzle",
    icon: "CloudDrizzle",
    gradient: "from-blue-500 via-slate-600 to-indigo-700",
    textColor: "text-blue-100",
    overlayClass: "bg-drizzle",
  },
  55: {
    label: "Dense Drizzle",
    icon: "CloudDrizzle",
    gradient: "from-indigo-500 via-slate-600 to-blue-800",
    textColor: "text-indigo-100",
    overlayClass: "bg-drizzle",
  },
  56: {
    label: "Light Freezing Drizzle",
    icon: "CloudSnow",
    gradient: "from-sky-400 via-blue-500 to-slate-600",
    textColor: "text-sky-100",
    overlayClass: "bg-snow",
  },
  57: {
    label: "Dense Freezing Drizzle",
    icon: "CloudSnow",
    gradient: "from-sky-500 via-blue-600 to-slate-700",
    textColor: "text-sky-100",
    overlayClass: "bg-snow",
  },
  61: {
    label: "Slight Rain",
    icon: "CloudRain",
    gradient: "from-blue-500 via-cyan-600 to-indigo-800",
    textColor: "text-blue-100",
    overlayClass: "bg-rain",
  },
  63: {
    label: "Moderate Rain",
    icon: "CloudRain",
    gradient: "from-blue-600 via-indigo-600 to-cyan-900",
    textColor: "text-blue-100",
    overlayClass: "bg-rain",
  },
  65: {
    label: "Heavy Rain",
    icon: "CloudRainWind",
    gradient: "from-blue-700 via-indigo-700 to-slate-900",
    textColor: "text-indigo-100",
    overlayClass: "bg-heavy-rain",
  },
  66: {
    label: "Light Freezing Rain",
    icon: "CloudSnow",
    gradient: "from-sky-500 via-cyan-600 to-indigo-900",
    textColor: "text-sky-100",
    overlayClass: "bg-snow",
  },
  67: {
    label: "Heavy Freezing Rain",
    icon: "CloudSnow",
    gradient: "from-sky-600 via-blue-700 to-slate-900",
    textColor: "text-sky-100",
    overlayClass: "bg-snow",
  },
  71: {
    label: "Slight Snowfall",
    icon: "Snowflake",
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
    textColor: "text-cyan-500",
    overlayClass: "bg-snow",
  },
  73: {
    label: "Moderate Snowfall",
    icon: "Snowflake",
    gradient: "from-sky-300 via-sky-500 to-indigo-700",
    textColor: "text-white",
    overlayClass: "bg-snow",
  },
  75: {
    label: "Heavy Snowfall",
    icon: "Snowflake",
    gradient: "from-zinc-100 via-sky-400 to-slate-700",
    textColor: "text-indigo-900",
    overlayClass: "bg-snow",
  },
  77: {
    label: "Snow Grains",
    icon: "Snowflake",
    gradient: "from-sky-400 via-zinc-400 to-slate-600",
    textColor: "text-slate-100",
    overlayClass: "bg-snow",
  },
  80: {
    label: "Slight Rain Showers",
    icon: "CloudDrizzle",
    gradient: "from-cyan-500 via-blue-500 to-slate-700",
    textColor: "text-cyan-100",
    overlayClass: "bg-rain",
  },
  81: {
    label: "Moderate Rain Showers",
    icon: "CloudRain",
    gradient: "from-blue-500 via-indigo-600 to-slate-800",
    textColor: "text-blue-100",
    overlayClass: "bg-rain",
  },
  82: {
    label: "Violent Rain Showers",
    icon: "CloudRainWind",
    gradient: "from-indigo-600 via-violet-700 to-slate-950",
    textColor: "text-indigo-100",
    overlayClass: "bg-heavy-rain",
  },
  85: {
    label: "Slight Snow Showers",
    icon: "Snowflake",
    gradient: "from-sky-400 via-blue-400 to-indigo-600",
    textColor: "text-white",
    overlayClass: "bg-snow",
  },
  86: {
    label: "Heavy Snow Showers",
    icon: "Snowflake",
    gradient: "from-sky-300 via-slate-400 to-indigo-800",
    textColor: "text-white",
    overlayClass: "bg-snow",
  },
  95: {
    label: "Thunderstorm",
    icon: "CloudLightning",
    gradient: "from-yellow-600 via-slate-700 to-neutral-900",
    textColor: "text-yellow-100",
    overlayClass: "bg-lightning",
  },
  96: {
    label: "Thunderstorm with Slight Hail",
    icon: "CloudLightning",
    gradient: "from-yellow-600 via-teal-700 to-slate-900",
    textColor: "text-yellow-100",
    overlayClass: "bg-lightning",
  },
  99: {
    label: "Thunderstorm with Heavy Hail",
    icon: "CloudLightning",
    gradient: "from-red-900 via-slate-800 to-zinc-950",
    textColor: "text-yellow-200",
    overlayClass: "bg-lightning",
  },
};

export function getWeatherConfig(code: number): WeatherConditionConfig {
  return WMO_CODE_MAP[code] || {
    label: "Unknown Conditions",
    icon: "HelpCircle",
    gradient: "from-slate-700 to-slate-900",
    textColor: "text-slate-300",
    overlayClass: "",
  };
}

// Convert Celsius to Fahrenheit
export function formatTemp(celsius: number, unit: "celsius" | "fahrenheit"): string {
  if (unit === "fahrenheit") {
    return `${Math.round((celsius * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

// Convert Wind Speed (base is km/h from Open-Meteo)
export function formatWind(kmh: number, unit: "kmh" | "mph" | "ms"): string {
  if (unit === "mph") {
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  if (unit === "ms") {
    return `${Math.round((kmh * 1000) / 3600)} m/s`;
  }
  return `${Math.round(kmh)} km/h`;
}

// Intelligence Weather Recommendation System
export function generateRecommendations(
  currentTemp: number,
  currentCode: number,
  humidity: number,
  windSpeed: number,
  uvIndexToday: number,
  precipitationProbMax: number,
  tempMax: number,
  tempMin: number
): IntelligenceRecommendation[] {
  const recommendations: IntelligenceRecommendation[] = [];

  // 1. Precipitation & Wet Weather
  if (precipitationProbMax >= 50 || [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(currentCode)) {
    recommendations.push({
      type: "warning",
      title: "Precipitation Expected",
      message: `High risk of rain or showers (${precipitationProbMax}% probability). Do not forget your umbrella, waterproof jacket, and sensible footwear!`,
      iconName: "Umbrella",
    });
  } else if (precipitationProbMax >= 20 && precipitationProbMax < 50) {
    recommendations.push({
      type: "neutral",
      title: "Slight Chance of Rain",
      message: `There's a minor chance of rain today (${precipitationProbMax}%). Keep an eye on the sky or pack a light packable poncho just in case.`,
      iconName: "CloudDrizzle",
    });
  }

  // 2. Temperature Safety & Dress Code
  if (currentTemp <= 5) {
    recommendations.push({
      type: "warning",
      title: "Freezing Temperatures",
      message: `Extremely cold at ${currentTemp}°C (${Math.round((currentTemp * 9) / 5 + 32)}°F). Bundle up! Wear heavy layers, gloves, a warm hat, and a thermal scarf.`,
      iconName: "ThermometerSnowflake",
    });
  } else if (currentTemp > 5 && currentTemp <= 14) {
    recommendations.push({
      type: "info",
      title: "Chilly conditions",
      message: `Cool weather (${currentTemp}°C). A warm coat or a thick sweater with a windbreaker is recommended for outdoor comfort.`,
      iconName: "Shirt",
    });
  } else if (currentTemp >= 15 && currentTemp <= 22) {
    recommendations.push({
      type: "success",
      title: "Mild & Comfortable",
      message: `Perfect light jacket or long-sleeve weather (${currentTemp}°C). Highly comfortable for walking, errands, and outdoor hobbies.`,
      iconName: "Smile",
    });
  } else if (currentTemp >= 23 && currentTemp <= 30) {
    recommendations.push({
      type: "success",
      title: "Warm & Sunny",
      message: `Warm outdoor conditions at ${currentTemp}°C. Light shirts and breathable clothing will keep you cool and dry today.`,
      iconName: "Sun",
    });
  } else if (currentTemp > 30) {
    recommendations.push({
      type: "warning",
      title: "Extreme Heat Warning",
      message: `Hot conditions reaching ${currentTemp}°C (${Math.round((currentTemp * 9) / 5 + 32)}°F). Stay hydrated, wear light-colored clothing, seek shade, and avoid outdoor activity midday.`,
      iconName: "Flame",
    });
  }

  // 3. Sun Protection / UV Index
  if (uvIndexToday >= 8) {
    recommendations.push({
      type: "warning",
      title: "Extreme UV Hazard",
      message: `Very strong solar radiation (UV index: ${uvIndexToday}). Apply high SPF sunscreen (30+), wear a wide-brimmed hat, and sunglasses before heading out.`,
      iconName: "ShieldAlert",
    });
  } else if (uvIndexToday >= 4 && uvIndexToday < 8) {
    recommendations.push({
      type: "info",
      title: "Moderate UV Levels",
      message: `Moderate UV index (${uvIndexToday}). Consider sunscreen if outdoors for more than 20 minutes, along with protective sunglasses.`,
      iconName: "SunDim",
    });
  }

  // 4. Wind Alert
  if (windSpeed >= 30) {
    recommendations.push({
      type: "warning",
      title: "Gale Warning / High Winds",
      message: `Strong winds up to ${Math.round(windSpeed)} km/h. Watch out for flying debris, secure loose patio items, and hold on tight to your umbrella!`,
      iconName: "Wind",
    });
  } else if (windSpeed >= 15 && windSpeed < 30) {
    recommendations.push({
      type: "neutral",
      title: "Breezy Conditions",
      message: `Modest breeze is felt (${Math.round(windSpeed)} km/h). Ideal for flying kites or sailing, but could feel chilly in combination with low temps.`,
      iconName: "Wind",
    });
  }

  // 5. Outdoor Activities Suitability Score
  const isWet = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99].includes(currentCode);
  const isColdOrHot = currentTemp < 10 || currentTemp > 32;

  if (!isWet && !isColdOrHot && windSpeed < 20) {
    recommendations.push({
      type: "success",
      title: "Ideal Outdoor Day",
      message: "Weather parameters are prime for a jog, picnic, cycling, hiking, or cleaning the car!",
      iconName: "Footprints",
    });
  } else if (isWet) {
    recommendations.push({
      type: "info",
      title: "Great Day for Indoor Activities",
      message: "Since wet weather is present, it is a perfect time to read a book, watch movies, visit a museum, or try indoor climbing.",
      iconName: "BookOpen",
    });
  }

  // Fallback if list is empty
  if (recommendations.length === 0) {
    recommendations.push({
      type: "neutral",
      title: "Standard Weather Day",
      message: "Conditions are steady. Pack standard items, check the 7-day forecast, and enjoy your day!",
      iconName: "Calendar",
    });
  }

  return recommendations;
}

// Map Lucide name to icons dynamically
import * as LucideIcons from "lucide-react";

export function getIconComponent(name: string): React.ComponentType<any> {
  const IconComponent = (LucideIcons as any)[name];
  return IconComponent || LucideIcons.HelpCircle;
}
