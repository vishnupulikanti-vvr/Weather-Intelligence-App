import { Wind, Droplets, Sun, Gauge, Cloud, Umbrella, Compass } from "lucide-react";
import { CurrentWeather, DailyForecast, TempUnit, WindUnit } from "../types";
import { formatTemp, formatWind } from "../utils";

interface WeatherDetailsGridProps {
  current: CurrentWeather;
  daily: DailyForecast;
  tempUnit: TempUnit;
  windUnit: WindUnit;
}

export default function WeatherDetailsGrid({ current, daily, tempUnit, windUnit }: WeatherDetailsGridProps) {
  // Humidity assessment
  const getHumidityLevel = (h: number) => {
    if (h < 30) return { text: "Dry Air", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    if (h <= 60) return { text: "Comfortable", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    return { text: "Sticky / Humid", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
  };

  const humidityLvl = getHumidityLevel(current.relativeHumidity);

  // Pressure interpretation
  const getPressureLevel = (p: number) => {
    if (p < 1009) return { text: "Low Pressure (Storm Risk)", color: "text-red-400" };
    if (p > 1022) return { text: "High Pressure (Clear Sky)", color: "text-amber-400" };
    return { text: "Normal Pressure", color: "text-slate-400" };
  };

  const pressureLvl = getPressureLevel(current.pressure);

  // UV index check
  const todayUv = daily.uvIndexMax[0] ?? 0;
  const getUvLevel = (uv: number) => {
    if (uv <= 2) return { text: "Low Exposure", color: "text-emerald-400", bg: "bg-emerald-500/10" };
    if (uv <= 5) return { text: "Moderate", color: "text-yellow-400", bg: "bg-yellow-500/10" };
    if (uv <= 7) return { text: "High Protection", color: "text-orange-400", bg: "bg-orange-500/10" };
    return { text: "Extreme Risk", color: "text-red-400", bg: "bg-red-500/10" };
  };
  const uvLvl = getUvLevel(todayUv);

  // Wind direction degrees to text compass heading
  const getWindHeading = (deg: number) => {
    const headings = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(((deg % 360) / 45) % 8);
    return headings[index] || "N";
  };
  const windHeading = getWindHeading(current.windDirection);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {/* 1. Apparent Temp (Feels Like) */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/50 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Feels Like</span>
          <Droplets className="h-4.5 w-4.5 text-indigo-400" />
        </div>
        <div className="mt-4">
          <span className="text-2xl sm:text-3xl font-extrabold text-white">
            {formatTemp(current.apparentTemperature, tempUnit)}
          </span>
          <div className="text-[10px] text-slate-400 mt-1.5 font-light">
            {Math.abs(current.apparentTemperature - current.temperature) < 1.5
              ? "Feels similar to the actual temperature."
              : current.apparentTemperature > current.temperature
              ? "Feels warmer than actual temp due to humidity."
              : "Feels colder than actual temp due to wind chill."}
          </div>
        </div>
      </div>

      {/* 2. Humidity */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/50 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Humidity</span>
          <Droplets className="h-4.5 w-4.5 text-blue-400 animate-pulse" />
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {current.relativeHumidity}%
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${humidityLvl.color}`}>
              {humidityLvl.text}
            </span>
          </div>
          <div className="mt-2.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" 
              style={{ width: `${current.relativeHumidity}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Wind speed & direction */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/50 transition-all flex flex-col justify-between col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Wind</span>
          <Wind className="h-4.5 w-4.5 text-teal-400" />
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {formatWind(current.windSpeed, windUnit)}
            </span>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
              <Compass className="h-3 w-3 text-teal-500" />
              <span>{windHeading} ({Math.round(current.windDirection)}°)</span>
            </div>
          </div>
          
          {/* Visual Compass Needle Indicator */}
          <div className="relative h-12 w-12 rounded-full border border-slate-800 bg-slate-950 flex items-center justify-center shrink-0">
            <div className="absolute text-[8px] text-slate-600 font-bold top-0.5 font-mono">N</div>
            <div 
              className="w-1 h-8 rounded-full bg-gradient-to-t from-transparent via-teal-500 to-teal-400 transition-transform duration-700"
              style={{ transform: `rotate(${current.windDirection}deg)` }}
            />
            <div className="h-2 w-2 rounded-full bg-slate-950 border border-slate-800" />
          </div>
        </div>
      </div>

      {/* 4. UV Index */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/50 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">UV Index</span>
          <Sun className="h-4.5 w-4.5 text-amber-500" />
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {todayUv}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${uvLvl.color} ${uvLvl.bg}`}>
              {uvLvl.text}
            </span>
          </div>
          <div className="mt-2.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-full" 
              style={{ width: `${Math.min((todayUv / 12) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5. Barometric Pressure */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/50 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Pressure</span>
          <Gauge className="h-4.5 w-4.5 text-purple-400" />
        </div>
        <div className="mt-4">
          <span className="text-2xl sm:text-3xl font-extrabold text-white">
            {current.pressure}
          </span>
          <span className="text-xs text-slate-400 ml-1 font-mono">hPa</span>
          <div className={`text-[10px] mt-2.5 font-medium ${pressureLvl.color}`}>
            {pressureLvl.text}
          </div>
        </div>
      </div>

      {/* 6. Precipitation & Clouds */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/50 transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Precipitation</span>
          <Umbrella className="h-4.5 w-4.5 text-cyan-400" />
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {current.precipitation}
            </span>
            <span className="text-xs text-slate-400 font-mono">mm</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 flex items-center gap-1.5">
            <Cloud className="h-3 w-3 text-slate-500 shrink-0" />
            <span>Cloud cover: <span className="text-slate-200 font-semibold">{current.cloudCover}%</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
