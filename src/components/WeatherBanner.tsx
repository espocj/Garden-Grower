"use client";

import React, { useEffect, useState } from 'react';
import { Sun, Cloud, CloudRain, Snowflake, Droplets, Wind } from "lucide-react";

// Helper to map OpenWeather icons to your Lucide icons
function WeatherIcon({ type, className, style }: { type: string, className?: string, style?: any }) {
  if (type.includes("Rain") || type.includes("Drizzle")) return <CloudRain className={className} style={{ color: "var(--sky)", ...style }} />;
  if (type.includes("Clear")) return <Sun className={className} style={{ color: "var(--gold)", ...style }} />;
  return <Cloud className={className} style={{ color: "var(--straw)", ...style }} />;
}

export default function WeatherBanner() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLog = async (lat: number, lon: number) => {
      const KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${KEY}&units=imperial`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Weather failed", e);
      } finally {
        setLoading(false);
      }
    };

    // Default to Bedford, NY
    navigator.geolocation.getCurrentPosition(
      (pos) => getLog(pos.coords.latitude, pos.coords.longitude),
      () => getLog(41.2043, -73.6438) 
    );
  }, []);

  // Show a "Loading" version of your bar so the page doesn't crash
  if (loading || !data) {
    return <div className="weather-banner px-4 py-3 text-center font-mono text-[0.6rem] text-sage uppercase tracking-widest">
      Syncing with Bedford Weather Stations...
    </div>;
  }

  // Logic to get 3 days (Today, Tomorrow, Next Day)
  const days = [data.list[0], data.list[8], data.list[16]].map((item, i) => ({
    label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
    icon: item.weather[0].main,
    high: Math.round(item.main.temp_max),
    low: Math.round(item.main.temp_min),
  }));

  // Find next rain in the 5-day forecast
  const rainNext = data.list.find((i: any) => i.weather[0].main === 'Rain');
  const nextRainDate = rainNext 
    ? new Date(rainNext.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : "No rain soon";

  // Check for frost (32 degrees or lower)
  const frostEntry = data.list.find((i: any) => i.main.temp_min <= 32);
  const nextFrost = frostEntry 
    ? new Date(frostEntry.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : "None forecast";

  return (
    <div className="weather-banner px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4 md:gap-8">

        {/* 3-day forecast (Real Data) */}
        <div className="flex items-center gap-4">
          {days.map((day) => (
            <div key={day.label} className="flex flex-col items-center gap-1 text-center" style={{ minWidth: "52px" }}>
              <span className="font-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "var(--sage)", textTransform: "uppercase" }}>
                {day.label}
              </span>
              <WeatherIcon type={day.icon} className="w-6 h-6" />
              <div className="flex gap-1 items-center" style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)" }}>
                <span style={{ color: "var(--cream)", fontWeight: 600 }}>{day.high}°</span>
                <span style={{ color: "var(--straw)" }}>/</span>
                <span style={{ color: "var(--straw)" }}>{day.low}°</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ width: "1px", height: "36px", background: "rgba(122,154,110,0.3)" }} className="hidden md:block" />

        {/* Dynamic Next Rain */}
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 flex-shrink-0" style={{ color: "var(--sky)" }} />
          <div>
            <div style={{ fontSize: "0.6rem", color: "var(--sage)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
              Next Rain
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--cream)", fontWeight: 500 }}>
              {nextRainDate}
            </div>
          </div>
        </div>

        {/* Dynamic Frost Alert */}
        <div className="flex items-center gap-2">
          <Snowflake className="w-4 h-4 flex-shrink-0" style={{ color: "var(--frost)" }} />
          <div>
            <div style={{ fontSize: "0.6rem", color: "var(--sage)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
              Next Frost
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--cream)", fontWeight: 500 }}>
              {nextFrost}
            </div>
          </div>
        </div>

        {/* Real Wind Speed */}
        <div className="flex items-center gap-2 ml-auto">
          <Wind className="w-4 h-4 flex-shrink-0" style={{ color: "var(--straw)" }} />
          <span style={{ fontSize: "0.78rem", color: "var(--straw)", fontFamily: "var(--font-mono)" }}>
             {Math.round(data.list[0].wind.speed)} mph
          </span>
        </div>

      </div>
    </div>
  );
}
