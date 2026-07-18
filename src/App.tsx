import { useState, useEffect } from "react";
import { CloudSun, RefreshCw, Thermometer, Wind, AlertCircle, Info, Sun } from "lucide-react";
import { City, WeatherData, TempUnit, WindUnit } from "./types";
import { generateRecommendations } from "./utils";
import SearchAndFavorites from "./components/SearchAndFavorites";
import CurrentWeatherCard from "./components/CurrentWeatherCard";
import WeatherDetailsGrid from "./components/WeatherDetailsGrid";
import HourlyForecastChart from "./components/HourlyForecastChart";
import Forecast7Day from "./components/Forecast7Day";
import WeatherRecommendations from "./components/WeatherRecommendations";

const DEFAULT_CITY: City = {
  id: 5128581,
  name: "New York",
  latitude: 40.71427,
  longitude: -74.00597,
  country: "United States",
  country_code: "US",
  timezone: "America/New_York",
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Unit Toggles with localStorage persistence
  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    return (localStorage.getItem("weather_intel_temp_unit") as TempUnit) || "celsius";
  });
  const [windUnit, setWindUnit] = useState<WindUnit>(() => {
    return (localStorage.getItem("weather_intel_wind_unit") as WindUnit) || "kmh";
  });

  // Load last searched city or default
  useEffect(() => {
    const savedCity = localStorage.getItem("weather_intel_last_city");
    if (savedCity) {
      try {
        setSelectedCity(JSON.parse(savedCity));
      } catch (e) {
        setSelectedCity(DEFAULT_CITY);
      }
    } else {
      setSelectedCity(DEFAULT_CITY);
    }
  }, []);

  // Fetch weather when city changes
  useEffect(() => {
    if (!selectedCity) return;

    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { latitude: lat, longitude: lon, timezone } = selectedCity;
        
        // Open-Meteo forecast parameters
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,pressure_msl&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=${encodeURIComponent(timezone)}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch weather data from Open-Meteo Forecast API");
        }
        
        const data = await response.json();
        
        const currentData = data.current;
        const hourlyData = data.hourly;
        const dailyData = data.daily;

        const parsedWeather: WeatherData = {
          city: selectedCity,
          current: {
            temperature: currentData.temperature_2m,
            relativeHumidity: currentData.relative_humidity_2m,
            apparentTemperature: currentData.apparent_temperature,
            isDay: currentData.is_day === 1,
            precipitation: currentData.precipitation,
            rain: currentData.rain,
            showers: currentData.showers,
            snowfall: currentData.snowfall,
            weatherCode: currentData.weather_code,
            cloudCover: currentData.cloud_cover,
            windSpeed: currentData.wind_speed_10m,
            windDirection: currentData.wind_direction_10m,
            pressure: currentData.pressure_msl,
            time: currentData.time,
          },
          hourly: {
            time: hourlyData.time,
            temperature2m: hourlyData.temperature_2m,
            precipitationProbability: hourlyData.precipitation_probability,
            weatherCode: hourlyData.weather_code,
          },
          daily: {
            time: dailyData.time,
            weatherCode: dailyData.weather_code,
            temperature2mMax: dailyData.temperature_2m_max,
            temperature2mMin: dailyData.temperature_2m_min,
            apparentTemperatureMax: dailyData.apparent_temperature_max,
            apparentTemperatureMin: dailyData.apparent_temperature_min,
            uvIndexMax: dailyData.uv_index_max,
            precipitationSum: dailyData.precipitation_sum,
            precipitationProbabilityMax: dailyData.precipitation_probability_max,
            windSpeed10mMax: dailyData.wind_speed_10m_max,
          },
          timezone: data.timezone,
          timezoneAbbreviation: data.timezone_abbreviation,
          elevation: data.elevation,
        };

        setWeatherData(parsedWeather);
        // Persist last city search
        localStorage.setItem("weather_intel_last_city", JSON.stringify(selectedCity));
      } catch (err: any) {
        console.error("Weather fetch failed:", err);
        setError("Unable to load weather forecast for this location. Please try again or select a different city.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCity]);

  // Handle toggles
  const handleTempUnitToggle = () => {
    const next = tempUnit === "celsius" ? "fahrenheit" : "celsius";
    setTempUnit(next);
    localStorage.setItem("weather_intel_temp_unit", next);
  };

  const handleWindUnitChange = (unit: WindUnit) => {
    setWindUnit(unit);
    localStorage.setItem("weather_intel_wind_unit", unit);
  };

  const triggerRefresh = () => {
    if (selectedCity) {
      // Toggle city slightly to trigger state refresh
      setSelectedCity({ ...selectedCity });
    }
  };

  // Generate actionable intelligence
  const recommendations = weatherData
    ? generateRecommendations(
        weatherData.current.temperature,
        weatherData.current.weatherCode,
        weatherData.current.relativeHumidity,
        weatherData.current.windSpeed,
        weatherData.daily.uvIndexMax[0] || 0,
        weatherData.daily.precipitationProbabilityMax[0] || 0,
        weatherData.daily.temperature2mMax[0] || 0,
        weatherData.daily.temperature2mMin[0] || 0
      )
    : [];

  return (
    <div className="min-h-screen bg-[#070a13] text-gray-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Decorative background grid and flares */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.08),rgba(255,255,255,0))]" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 relative z-10 space-y-6">
        
        {/* Navigation / Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <CloudSun className="h-5.5 w-5.5 text-white animate-pulse" />
            </div>
            <div>
              <h1 id="app-title" className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Weather Intelligence
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 tracking-wider uppercase font-medium">
                Live Analysis & Decision Forecasting
              </p>
            </div>
          </div>

          {/* Unit Control Panel */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            {/* Temp Unit Slider Toggle */}
            <button
              type="button"
              id="temp-unit-toggle"
              onClick={handleTempUnitToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 hover:text-white transition-all text-xs font-semibold shadow-sm text-slate-300"
              title="Toggle Temperature Unit"
            >
              <Thermometer className="h-3.5 w-3.5 text-indigo-400" />
              <span>Unit: {tempUnit === "celsius" ? "°C" : "°F"}</span>
            </button>

            {/* Wind Unit Selection Dropdown */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
              {(["kmh", "mph", "ms"] as WindUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  id={`wind-unit-btn-${u}`}
                  onClick={() => handleWindUnitChange(u)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wide transition-all ${
                    windUnit === u
                      ? "bg-slate-800 text-white shadow-inner font-extrabold"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {u === "ms" ? "m/s" : u === "kmh" ? "km/h" : u}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              type="button"
              id="refresh-weather-btn"
              onClick={triggerRefresh}
              disabled={isLoading || !selectedCity}
              className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 hover:text-white transition-all text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh weather data"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-indigo-400" : ""}`} />
            </button>
          </div>
        </header>

        {/* Dashboard Core Content Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Search and Current Details (Span 4) */}
          <section className="lg:col-span-4 space-y-6">
            <div className="bg-slate-950/40 border border-slate-800/40 rounded-2xl p-4 sm:p-5 shadow-lg shadow-black/5">
              <SearchAndFavorites
                selectedCity={selectedCity}
                onCitySelect={(city) => setSelectedCity(city)}
              />
            </div>

            {selectedCity && weatherData && !isLoading && (
              <CurrentWeatherCard
                city={selectedCity}
                current={weatherData.current}
                daily={weatherData.daily}
                tempUnit={tempUnit}
              />
            )}

            {/* Loading skeletons for left side current weather */}
            {isLoading && (
              <div className="animate-pulse space-y-4">
                <div className="h-[280px] bg-slate-900/60 rounded-3xl border border-slate-800 flex items-center justify-center">
                  <div className="text-slate-500 text-xs font-mono">Syncing meteorology models...</div>
                </div>
              </div>
            )}
          </section>

          {/* RIGHT PANEL: Analytics, 24h graph, Details, 7d forecast (Span 8) */}
          <section className="lg:col-span-8 space-y-6">
            {error && (
              <div className="bg-red-950/20 border border-red-900/50 rounded-2xl p-6 text-red-300 space-y-3.5 flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-200">Weather Retrieval Obstruction</h4>
                  <p className="text-xs leading-relaxed text-slate-400">{error}</p>
                  <button
                    type="button"
                    onClick={triggerRefresh}
                    className="mt-3 px-3 py-1.5 bg-red-900/30 border border-red-800/40 rounded-lg text-xs font-bold text-red-200 hover:bg-red-900/50 transition-all"
                  >
                    Attempt Re-synchronization
                  </button>
                </div>
              </div>
            )}

            {!error && weatherData && !isLoading && (
              <>
                {/* 1. Intelligence advice panel */}
                <WeatherRecommendations recommendations={recommendations} />

                {/* 2. Interactive line/bar chart curve */}
                <HourlyForecastChart
                  hourly={weatherData.hourly}
                  tempUnit={tempUnit}
                  cityTimezone={weatherData.timezone}
                />

                {/* 3. Bento Detailed grid */}
                <WeatherDetailsGrid
                  current={weatherData.current}
                  daily={weatherData.daily}
                  tempUnit={tempUnit}
                  windUnit={windUnit}
                />

                {/* 4. 7-Day Trend list */}
                <Forecast7Day
                  daily={weatherData.daily}
                  tempUnit={tempUnit}
                  cityTimezone={weatherData.timezone}
                />
              </>
            )}

            {/* Big unified loading skeletons for core widgets */}
            {isLoading && (
              <div className="space-y-6 animate-pulse">
                {/* Insights skeleton */}
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 h-[120px] flex items-center justify-center">
                  <div className="text-slate-500 text-xs font-mono">Formulating recommendations...</div>
                </div>
                {/* Hourly chart skeleton */}
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 h-[220px] flex items-center justify-center">
                  <div className="text-slate-500 text-xs font-mono">Synthesizing curve points...</div>
                </div>
                {/* Details grid skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-slate-900/40 border border-slate-800/60 rounded-2xl h-[100px]" />
                  ))}
                </div>
              </div>
            )}
          </section>

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/40 pt-6 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Open-Meteo Integration Synchronized</span>
          </div>
          <div>
            Data sourced from <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Open-Meteo API</a>. Highly optimized for decision-making.
          </div>
        </footer>

      </div>
    </div>
  );
}
