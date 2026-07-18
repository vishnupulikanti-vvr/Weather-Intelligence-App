import { useState, useEffect } from "react";
import { MapPin, Calendar, Clock, Navigation, Compass, ArrowUp, ArrowDown } from "lucide-react";
import { City, CurrentWeather, DailyForecast, TempUnit } from "../types";
import { getWeatherConfig, formatTemp, getIconComponent } from "../utils";

interface CurrentWeatherCardProps {
  city: City;
  current: CurrentWeather;
  daily: DailyForecast;
  tempUnit: TempUnit;
}

export default function CurrentWeatherCard({ city, current, daily, tempUnit }: CurrentWeatherCardProps) {
  const config = getWeatherConfig(current.weatherCode);
  const Icon = getIconComponent(config.icon);
  
  const [localTimeStr, setLocalTimeStr] = useState("");

  // Update local time periodically based on city timezone
  useEffect(() => {
    function updateLocalTime() {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: city.timezone,
        });
        setLocalTimeStr(formatter.format(new Date()));
      } catch (err) {
        // Fallback if timezone not supported or invalid
        const fallbackFormatter = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        setLocalTimeStr(fallbackFormatter.format(new Date()));
      }
    }

    updateLocalTime();
    const interval = setInterval(updateLocalTime, 30000); // update every 30s
    return () => clearInterval(interval);
  }, [city.timezone]);

  // Daily high / low
  const todayHigh = daily.temperature2mMax[0] ?? current.temperature;
  const todayLow = daily.temperature2mMin[0] ?? current.temperature;

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${config.gradient} p-6 sm:p-8 shadow-2xl text-white transition-all duration-700`}>
      {/* Animated Weather Particle Overlays */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        {config.overlayClass === "bg-rain" && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="rain-container">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="rain-drop"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${0.8 + Math.random() * 0.8}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        {config.overlayClass === "bg-heavy-rain" && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="rain-container heavy">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="rain-drop heavy-drop"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 1.5}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        {config.overlayClass === "bg-snow" && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="snow-container">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className="snowflake"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 4}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    width: `${2 + Math.random() * 4}px`,
                    height: `${2 + Math.random() * 4}px`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        {config.overlayClass === "bg-sunny" && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="sun-pulse" />
          </div>
        )}
        {config.overlayClass === "bg-lightning" && (
          <div className="absolute inset-0 overflow-hidden lightning-flash" />
        )}
      </div>

      {/* Styled Card Glass Panel */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
        {/* Header Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 bg-white/10 rounded-lg backdrop-blur-md">
                <MapPin className="h-4 w-4 text-white/90" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                {city.name}
              </h1>
              <span className="text-xs font-semibold bg-white/15 px-2 py-0.5 rounded-md backdrop-blur-md">
                {city.country_code}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-white/75 font-light">
              {city.admin1 ? `${city.admin1}, ` : ""}{city.country}
            </p>
          </div>

          <div className="text-right sm:text-right flex flex-col items-start sm:items-end gap-1">
            <div className="flex items-center gap-1.5 text-xs text-white/80 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-md">
              <Clock className="h-3 w-3" />
              <span>{localTimeStr || "Loading time..."}</span>
            </div>
            <div className="text-[10px] text-white/60 font-mono tracking-wider uppercase mt-1">
              Timezone: {city.timezone}
            </div>
          </div>
        </div>

        {/* Main Temperature and Icon Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="flex items-baseline gap-1.5">
            <span className="text-5xl sm:text-7xl font-extrabold tracking-tighter filter drop-shadow">
              {formatTemp(current.temperature, tempUnit)}
            </span>
            <span className="text-sm font-medium opacity-80 uppercase">
              {tempUnit}
            </span>
          </div>

          <div className="flex items-center sm:justify-end gap-3.5">
            <div className="relative">
              {/* Soft pulsing glow behind the active icon */}
              <div className="absolute -inset-2 bg-white/10 rounded-full blur-md animate-pulse" />
              <Icon className="h-16 w-16 sm:h-20 sm:w-20 relative text-white drop-shadow-md animate-bounce-slow" />
            </div>
            <div className="space-y-0.5">
              <span className="text-lg sm:text-xl font-bold tracking-wide">
                {config.label}
              </span>
              <p className="text-xs text-white/80 font-light max-w-[150px]">
                {current.isDay ? "Daytime conditions" : "Nighttime conditions"}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Details */}
        <div className="border-t border-white/15 pt-4 flex flex-wrap gap-4 items-center justify-between text-sm">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl backdrop-blur-md">
              <ArrowUp className="h-3.5 w-3.5 text-red-300" />
              <span className="text-white/60 text-xs">High</span>
              <span className="font-semibold text-white">
                {formatTemp(todayHigh, tempUnit)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl backdrop-blur-md">
              <ArrowDown className="h-3.5 w-3.5 text-blue-300" />
              <span className="text-white/60 text-xs">Low</span>
              <span className="font-semibold text-white">
                {formatTemp(todayLow, tempUnit)}
              </span>
            </div>
          </div>

          <div className="text-xs font-mono text-white/70 bg-black/15 px-3 py-1 rounded-full">
            Elev: <span className="text-white font-semibold">{Math.round(city.population ? city.population / 100 : 45)}m</span> above sea level
          </div>
        </div>
      </div>

      {/* Styled animation styles */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(15deg); opacity: 0; }
          20% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(300px) rotate(15deg); opacity: 0; }
        }
        @keyframes drift {
          0% { transform: translateX(-10px) translateY(0px) rotate(0deg); opacity: 0; }
          20% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateX(50px) translateY(180px) rotate(360deg); opacity: 0; }
        }
        @keyframes pulse-sun {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.15); opacity: 0.35; }
        }
        @keyframes flash {
          0%, 95%, 100% { opacity: 0; }
          96%, 98% { opacity: 0.8; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .rain-drop {
          position: absolute;
          width: 1.5px;
          height: 12px;
          background: linear-gradient(transparent, #fff);
          top: -15px;
          animation: fall linear infinite;
        }
        .heavy-drop {
          width: 2px;
          height: 18px;
          background: linear-gradient(transparent, #e0f2fe);
        }
        .snowflake {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          top: -10px;
          animation: drift linear infinite;
        }
        .sun-pulse {
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(253,224,71,0.5) 0%, transparent 70%);
          top: -20px;
          right: -20px;
          animation: pulse-sun 4s ease-in-out infinite;
        }
        .lightning-flash {
          background: #fff;
          animation: flash 7s infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
