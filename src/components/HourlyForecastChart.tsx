import { useState, useMemo } from "react";
import { CloudRain, Timer, TrendingUp } from "lucide-react";
import { HourlyForecast, TempUnit } from "../types";
import { formatTemp, getWeatherConfig, getIconComponent } from "../utils";

interface HourlyForecastChartProps {
  hourly: HourlyForecast;
  tempUnit: TempUnit;
  cityTimezone: string;
}

export default function HourlyForecastChart({ hourly, tempUnit, cityTimezone }: HourlyForecastChartProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Filter or align hourly data to show the next 24 hours starting around the current hour
  const hourlyData = useMemo(() => {
    try {
      // Find current hour index based on city's local time
      const cityLocalTime = new Date(new Date().toLocaleString("en-US", { timeZone: cityTimezone }));
      const currentHourStr = cityLocalTime.toISOString().substring(0, 13) + ":00";
      
      let startIndex = 0;
      // Search for the closest time index
      for (let i = 0; i < hourly.time.length; i++) {
        if (hourly.time[i].startsWith(currentHourStr)) {
          startIndex = i;
          break;
        }
      }

      // If not found or near end, fallback to index 0
      if (startIndex > hourly.time.length - 12) {
        startIndex = 0;
      }

      // Take the next 24 hourly periods
      const sliceEnd = Math.min(startIndex + 24, hourly.time.length);
      const items = [];
      for (let i = startIndex; i < sliceEnd; i++) {
        const timeObj = new Date(hourly.time[i]);
        const formattedHour = timeObj.toLocaleString("en-US", {
          hour: "numeric",
          hour12: true,
          timeZone: cityTimezone,
        });

        items.push({
          index: i - startIndex,
          rawTime: hourly.time[i],
          hourLabel: formattedHour,
          temp: hourly.temperature2m[i],
          rainProb: hourly.precipitationProbability[i],
          code: hourly.weatherCode[i],
        });
      }
      return items;
    } catch (e) {
      // Fallback
      return hourly.time.slice(0, 24).map((t, idx) => ({
        index: idx,
        rawTime: t,
        hourLabel: new Date(t).toLocaleTimeString([], { hour: "2-digit" }),
        temp: hourly.temperature2m[idx],
        rainProb: hourly.precipitationProbability[idx],
        code: hourly.weatherCode[idx],
      }));
    }
  }, [hourly, cityTimezone]);

  // SVG Chart Geometry Calculations
  const chartDimensions = useMemo(() => {
    if (hourlyData.length === 0) return { points: "", areaPoints: "", minTemp: 0, maxTemp: 0 };

    const temperatures = hourlyData.map((d) => d.temp);
    const maxTemp = Math.max(...temperatures);
    const minTemp = Math.min(...temperatures);
    const tempRange = maxTemp - minTemp === 0 ? 1 : maxTemp - minTemp;

    // Grid coordinates
    const width = 800;
    const height = 140;
    const paddingLeft = 30;
    const paddingRight = 30;
    const paddingTop = 25;
    const paddingBottom = 20;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const pointsArray = hourlyData.map((d, i) => {
      const x = paddingLeft + (i / (hourlyData.length - 1)) * chartWidth;
      // Invert Y so higher temperature is at the top
      const normalizedY = (d.temp - minTemp) / tempRange;
      const y = height - paddingBottom - normalizedY * chartHeight;
      return { x, y, temp: d.temp, rainProb: d.rainProb, label: d.hourLabel };
    });

    // Create polyline path string
    const linePath = pointsArray.map((p) => `${p.x},${p.y}`).join(" ");

    // Create closed area path string
    const areaPath = `${paddingLeft},${height - paddingBottom} ` + 
                     linePath + 
                     ` ${width - paddingRight},${height - paddingBottom}`;

    return {
      pointsArray,
      linePath,
      areaPath,
      maxTemp,
      minTemp,
      width,
      height,
      paddingBottom,
      chartHeight,
      paddingLeft,
      chartWidth,
    };
  }, [hourlyData]);

  const activeItem = hourlyData[activeIndex] || hourlyData[0];
  const activeConfig = activeItem ? getWeatherConfig(activeItem.code) : null;
  const ActiveIcon = activeConfig ? getIconComponent(activeConfig.icon) : null;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/50 transition-all space-y-5">
      {/* Chart Title and Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            24-Hour Intel Curve
          </h3>
        </div>

        {activeItem && (
          <div className="flex items-center gap-3 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-medium">
            <span className="text-slate-400">At {activeItem.hourLabel}:</span>
            <span className="text-indigo-300 font-bold">
              {formatTemp(activeItem.temp, tempUnit)}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 flex items-center gap-1">
              <CloudRain className="h-3 w-3" /> {activeItem.rainProb}% rain
            </span>
          </div>
        )}
      </div>

      {/* SVG Line & Area Chart visualization */}
      <div className="relative w-full overflow-x-auto scrollbar-thin">
        <div className="min-w-[760px] h-[160px] relative select-none">
          {/* Main SVG drawing */}
          <svg
            viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`}
            className="w-full h-full overflow-visible"
          >
            <defs>
              {/* Temperature Area Gradient */}
              <linearGradient id="tempAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
              
              {/* Active Dot Pulse */}
              <radialGradient id="activeDotGlow">
                <stop offset="0%" stopColor="#fff" stopOpacity="1" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Precipitation probability translucent bars */}
            {chartDimensions.pointsArray?.map((p, i) => {
              const barWidth = 14;
              const barHeight = (p.rainProb / 100) * (chartDimensions.chartHeight + 10);
              const xPos = p.x - barWidth / 2;
              const yPos = chartDimensions.height - chartDimensions.paddingBottom - barHeight;

              return (
                <g key={`bar-${i}`} className="transition-all duration-300">
                  <rect
                    x={xPos}
                    y={yPos}
                    width={barWidth}
                    height={Math.max(barHeight, 2)} // at least 2px height
                    rx="2"
                    className={`${
                      i === activeIndex
                        ? "fill-cyan-400/50 stroke-cyan-300/40"
                        : "fill-cyan-500/15 group-hover:fill-cyan-500/25"
                    } transition-colors cursor-pointer`}
                    onClick={() => setActiveIndex(i)}
                  />
                  {p.rainProb > 0 && (
                    <text
                      x={p.x}
                      y={yPos - 4}
                      textAnchor="middle"
                      className="text-[8px] font-mono fill-cyan-400/80 font-semibold"
                    >
                      {p.rainProb}%
                    </text>
                  )}
                </g>
              );
            })}

            {/* Ambient grid helper lines */}
            <line
              x1={chartDimensions.paddingLeft}
              y1={chartDimensions.height - chartDimensions.paddingBottom}
              x2={chartDimensions.width - chartDimensions.paddingLeft}
              y2={chartDimensions.height - chartDimensions.paddingBottom}
              className="stroke-slate-800"
              strokeWidth="1.5"
            />

            {/* Closed Gradient Area */}
            <polygon
              points={chartDimensions.areaPath}
              fill="url(#tempAreaGrad)"
              className="transition-all duration-700"
            />

            {/* Temperature Line */}
            <polyline
              fill="none"
              stroke="#818cf8"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={chartDimensions.linePath}
              className="transition-all duration-700 drop-shadow-[0_2px_8px_rgba(99,102,241,0.4)]"
            />

            {/* Hotspots / Interactive Tap dots */}
            {chartDimensions.pointsArray?.map((p, i) => {
              const isActive = i === activeIndex;
              return (
                <g key={`point-${i}`} className="cursor-pointer" onClick={() => setActiveIndex(i)}>
                  {/* Invisible broad tap target for fat fingers on touchscreens */}
                  <circle cx={p.x} cy={p.y} r="16" fill="transparent" />

                  {/* Visual point */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isActive ? "7" : "3.5"}
                    className={`${
                      isActive ? "fill-indigo-400 stroke-white" : "fill-slate-900 stroke-indigo-400"
                    } transition-all duration-300`}
                    strokeWidth={isActive ? "2.5" : "2"}
                  />
                  
                  {/* Temp values above nodes */}
                  <text
                    x={p.x}
                    y={p.y - (isActive ? 12 : 9)}
                    textAnchor="middle"
                    className={`text-[9px] font-bold font-mono ${
                      isActive ? "fill-white text-xs" : "fill-slate-400"
                    } transition-all`}
                  >
                    {formatTemp(p.temp, tempUnit)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Scroller cards representing hours */}
      <div className="flex gap-2.5 overflow-x-auto pb-1.5 pt-1 scrollbar-thin">
        {hourlyData.map((item, idx) => {
          const config = getWeatherConfig(item.code);
          const Icon = getIconComponent(config.icon);
          const isActive = idx === activeIndex;

          return (
            <button
              key={item.index}
              type="button"
              id={`hourly-card-${idx}`}
              onClick={() => setActiveIndex(idx)}
              className={`flex flex-col items-center justify-between p-3 rounded-xl min-w-[70px] border transition-all ${
                isActive
                  ? "bg-indigo-500/15 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/5 scale-102"
                  : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-900 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <span className="text-[10px] font-medium tracking-wide uppercase">
                {item.hourLabel.replace(":00", "")}
              </span>
              
              <Icon className={`h-6 w-6 my-2.5 ${isActive ? "text-indigo-400 animate-pulse" : "text-slate-400"}`} />
              
              <span className="text-xs font-bold text-slate-100 font-mono">
                {formatTemp(item.temp, tempUnit)}
              </span>

              {item.rainProb > 0 && (
                <span className="text-[9px] font-mono font-medium text-cyan-400 flex items-center gap-0.5 mt-1.5 bg-cyan-950/40 px-1 py-0.5 rounded">
                  <CloudRain className="h-2 w-2" />
                  {item.rainProb}%
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
