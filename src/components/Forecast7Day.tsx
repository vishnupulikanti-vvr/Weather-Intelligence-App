import { CalendarDays, CloudRain, ArrowUp, ArrowDown } from "lucide-react";
import { DailyForecast, TempUnit } from "../types";
import { formatTemp, getWeatherConfig, getIconComponent } from "../utils";

interface Forecast7DayProps {
  daily: DailyForecast;
  tempUnit: TempUnit;
  cityTimezone: string;
}

export default function Forecast7Day({ daily, tempUnit, cityTimezone }: Forecast7DayProps) {
  // Find extreme limits of the 7-day period for relative temp-bar bounds
  const overallMin = Math.min(...daily.temperature2mMin);
  const overallMax = Math.max(...daily.temperature2mMax);
  const overallRange = overallMax - overallMin === 0 ? 1 : overallMax - overallMin;

  const daysList = daily.time.map((dateStr, idx) => {
    const config = getWeatherConfig(daily.weatherCode[idx]);
    const Icon = getIconComponent(config.icon);

    // Get weekday string
    let dayName = "";
    if (idx === 0) {
      dayName = "Today";
    } else {
      const dateObj = new Date(dateStr + "T00:00:00");
      dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
    }

    // Daily High/Low
    const tMax = daily.temperature2mMax[idx];
    const tMin = daily.temperature2mMin[idx];

    // Calculate bar offsets relative to weekly extremes
    const leftOffset = ((tMin - overallMin) / overallRange) * 100;
    const barWidth = ((tMax - tMin) / overallRange) * 100;

    return {
      index: idx,
      dayName,
      dateLabel: new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      config,
      Icon,
      tMax,
      tMin,
      rainProbMax: daily.precipitationProbabilityMax[idx] ?? 0,
      precipitationSum: daily.precipitationSum[idx] ?? 0,
      leftOffset: Math.max(0, Math.min(leftOffset, 100)),
      barWidth: Math.max(3, Math.min(barWidth, 100)),
    };
  });

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/50 transition-all space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
        <CalendarDays className="h-4 w-4 text-indigo-400" />
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          7-Day Strategic Trend
        </h3>
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {daysList.map((day) => (
          <div
            key={day.index}
            className="grid grid-cols-12 gap-2 sm:gap-4 items-center text-sm py-1.5 border-b border-slate-900/50 last:border-0 last:pb-0"
          >
            {/* Weekday & Date Label */}
            <div className="col-span-3 sm:col-span-2">
              <span className="font-bold text-slate-200 block text-xs sm:text-sm">
                {day.dayName}
              </span>
              <span className="text-[10px] text-slate-500 block font-mono">
                {day.dateLabel}
              </span>
            </div>

            {/* Icon & Rain Chance */}
            <div className="col-span-3 sm:col-span-3 flex items-center gap-2">
              <div className="relative shrink-0">
                <day.Icon className="h-5.5 w-5.5 text-indigo-400" />
              </div>
              <div className="leading-tight">
                <span className="text-xs font-semibold text-slate-300 block truncate max-w-[80px] sm:max-w-[120px]">
                  {day.config.label}
                </span>
                {day.rainProbMax > 15 && (
                  <span className="text-[9px] font-mono font-semibold text-cyan-400 bg-cyan-950/40 px-1 py-0.5 rounded flex items-center gap-0.5 w-fit mt-0.5">
                    <CloudRain className="h-2 w-2" />
                    {day.rainProbMax}%
                  </span>
                )}
              </div>
            </div>

            {/* Min Temp */}
            <div className="col-span-2 sm:col-span-1 text-right sm:text-left text-xs font-semibold text-slate-400 font-mono">
              {formatTemp(day.tMin, tempUnit)}
            </div>

            {/* Slider track visualization */}
            <div className="col-span-2 sm:col-span-5 relative h-2.5 bg-slate-950/80 rounded-full overflow-hidden mx-1.5 hidden sm:block">
              <div
                className="absolute h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-amber-400"
                style={{
                  left: `${day.leftOffset}%`,
                  width: `${day.barWidth}%`,
                }}
              />
            </div>

            {/* Max Temp */}
            <div className="col-span-2 sm:col-span-1 text-right text-xs font-extrabold text-white font-mono">
              {formatTemp(day.tMax, tempUnit)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
