import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Star, X, Loader2 } from "lucide-react";
import { City } from "../types";

interface SearchAndFavoritesProps {
  onCitySelect: (city: City) => void;
  selectedCity: City | null;
}

const DEFAULT_CITIES: City[] = [
  { id: 5128581, name: "New York", latitude: 40.71427, longitude: -74.00597, country: "United States", country_code: "US", timezone: "America/New_York" },
  { id: 2643743, name: "London", latitude: 51.50853, longitude: -0.12574, country: "United Kingdom", country_code: "GB", timezone: "Europe/London" },
  { id: 1850147, name: "Tokyo", latitude: 35.6895, longitude: 139.69171, country: "Japan", country_code: "JP", timezone: "Asia/Tokyo" },
  { id: 2147714, name: "Sydney", latitude: -33.86785, longitude: 151.20732, country: "Australia", country_code: "AU", timezone: "Australia/Sydney" },
  { id: 2988507, name: "Paris", latitude: 48.85341, longitude: 2.3488, country: "France", country_code: "FR", timezone: "Europe/Paris" },
  { id: 1275339, name: "Mumbai", latitude: 19.07283, longitude: 72.88261, country: "India", country_code: "IN", timezone: "Asia/Kolkata" },
];

export default function SearchAndFavorites({ onCitySelect, selectedCity }: SearchAndFavoritesProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<City[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load favorites on mount
  useEffect(() => {
    const saved = localStorage.getItem("weather_intelligence_favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing favorites", e);
      }
    } else {
      // Default initial favorites
      setFavorites(DEFAULT_CITIES.slice(0, 3));
    }
  }, []);

  // Handle outside clicks to close autocomplete dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced API call for search autocomplete
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const results: City[] = data.results.map((item: any) => ({
            id: item.id,
            name: item.name,
            latitude: item.latitude,
            longitude: item.longitude,
            country: item.country,
            admin1: item.admin1,
            country_code: item.country_code,
            timezone: item.timezone || "GMT",
            population: item.population,
          }));
          setSuggestions(results);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setError("No matching cities found. Try another spelling!");
        }
      } catch (err) {
        console.error("Geocoding fetch error:", err);
        setError("Network error fetching location suggestions.");
      } finally {
        setIsLoading(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelectCity = (city: City) => {
    onCitySelect(city);
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const firstMatch: City = {
          id: data.results[0].id,
          name: data.results[0].name,
          latitude: data.results[0].latitude,
          longitude: data.results[0].longitude,
          country: data.results[0].country,
          admin1: data.results[0].admin1,
          country_code: data.results[0].country_code,
          timezone: data.results[0].timezone || "GMT",
          population: data.results[0].population,
        };
        handleSelectCity(firstMatch);
      } else {
        setError(`Could not find a city named "${query}". Please check the spelling.`);
      }
    } catch (err) {
      setError("Network error searching for this city.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle favorite state
  const isFavorite = selectedCity && favorites.some((fav) => fav.id === selectedCity.id);

  const toggleFavorite = () => {
    if (!selectedCity) return;
    
    let updated: City[];
    if (isFavorite) {
      updated = favorites.filter((fav) => fav.id !== selectedCity.id);
    } else {
      updated = [...favorites, selectedCity];
    }
    
    setFavorites(updated);
    localStorage.setItem("weather_intelligence_favorites", JSON.stringify(updated));
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Input Container */}
      <div className="relative" ref={dropdownRef}>
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            id="city-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for cities worldwide (e.g. Paris, Tokyo, Cairo)..."
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl py-3.5 pl-12 pr-12 text-gray-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm shadow-lg shadow-black/10"
          />
          <div className="absolute left-4 text-slate-400">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </div>
          {query && (
            <button
              type="button"
              id="clear-search-btn"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
              }}
              className="absolute right-4 p-0.5 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Dropdown suggestions */}
        {showDropdown && (suggestions.length > 0 || error) && (
          <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-150">
            {error ? (
              <div className="p-4 text-sm text-red-400/90 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            ) : (
              <ul className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
                {suggestions.map((city) => (
                  <li key={city.id}>
                    <button
                      type="button"
                      id={`city-suggestion-${city.id}`}
                      onClick={() => handleSelectCity(city)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-800/70 flex items-center justify-between transition-colors text-sm group"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                        <div>
                          <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
                            {city.name}
                          </span>
                          <span className="text-xs text-slate-400 ml-2">
                            {city.admin1 ? `${city.admin1}, ` : ""}{city.country}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-medium tracking-wide bg-slate-800 text-slate-300 group-hover:bg-indigo-950/50 group-hover:text-indigo-300 px-1.5 py-0.5 rounded transition-colors uppercase">
                        {city.country_code}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Error and Info Displays */}
      {error && !showDropdown && (
        <div className="p-4 bg-red-950/40 border border-red-900/50 rounded-xl text-red-400 text-xs flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Favorite Pins / Quick Access Panel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Star className="h-3 w-3 fill-amber-400/10 text-amber-400" />
            My Saved Locations
          </h3>
          {selectedCity && (
            <button
              type="button"
              id="favorite-toggle-btn"
              onClick={toggleFavorite}
              className={`text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                isFavorite
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <Star className={`h-3 w-3 ${isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
              {isFavorite ? "Saved" : "Save Active City"}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {favorites.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-1">
              No saved cities yet. Search a city and click &quot;Save Active City&quot; to keep it here.
            </p>
          ) : (
            favorites.map((city) => {
              const isActive = selectedCity?.id === city.id;
              return (
                <div key={city.id} className="relative group/pin">
                  <button
                    type="button"
                    id={`fav-pin-${city.id}`}
                    onClick={() => onCitySelect(city)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isActive
                        ? "bg-indigo-500/20 border-indigo-500/60 text-indigo-300 shadow-md shadow-indigo-500/5"
                        : "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover/pin:bg-indigo-400 transition-colors shrink-0" />
                    <span>{city.name}</span>
                    <span className="text-[10px] text-slate-500 font-normal group-hover/pin:text-slate-400">
                      {city.country_code}
                    </span>
                  </button>
                  
                  {/* Small unpin hover button */}
                  <button
                    type="button"
                    id={`unpin-${city.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      const updated = favorites.filter((fav) => fav.id !== city.id);
                      setFavorites(updated);
                      localStorage.setItem("weather_intelligence_favorites", JSON.stringify(updated));
                    }}
                    className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-slate-800 text-slate-400 hover:text-white hover:bg-red-950 border border-slate-700/80 rounded-full flex items-center justify-center opacity-0 group-hover/pin:opacity-100 transition-all shadow shadow-black/30"
                    title="Remove from favorites"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
