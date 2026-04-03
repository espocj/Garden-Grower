"use client";

import React, { useEffect, useState } from 'react';
import { Sun, Cloud, CloudRain, Snowflake, Droplets, Wind, AlertCircle } from "lucide-react";

function WeatherIcon({ type, className, style }: { type: string, className?: string, style?: any }) {
  if (type.includes("Rain") || type.includes("Drizzle")) return <CloudRain className={className} style={{ color: "var(--sky)", ...style }} />;
  if (type.includes("Clear")) return <Sun className={className} style={{ color: "var(--gold)", ...style }} />;
  return <Cloud className={className} style={{ color: "var(--straw)", ...style }} />;
}

export default function WeatherBanner() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLog = async (lat: number, lon: number) => {
      const KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      
      if (!KEY) {
        setError("Missing API Key in Vercel Settings");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${KEY}&units=imperial`);
        if (res.status === 401) {
          setError("Weather Key not active yet (Wait 30min)");
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError("Connection error");
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => getLog(pos.coords.latitude, pos.coords.longitude),
      () => getLog(41.2043, -73.6438) // Bedford, NY
    );
  }, []);

  if (loading) return <div className="weather-banner px-4 py-3 text-center font-mono text-[0.6rem] text-sage uppercase tracking-widest animate-pulse">Syncing Bedford Weather...</div>;

  // If there's an error, show a subtle warning instead of crashing
  if (error || !data || !data.list) {
    return (
      <div className="weather-banner px-4 py-2 flex items-center justify-center gap-2 text-[0.6rem] font-mono text-rust/70 uppercase tracking-widest">
        <AlertCircle size={12} /> {error || "Weather Offline"}
      </div>
    );
  }

  const current = data.list[0];
  const days = [data.list[0], data.list[8], data.list[16]].map((item, i) => ({
    label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
    icon: item.weather[0].main,
    high: Math.round(item.main.temp_max),
    low: Math.round(item.main.temp_min),
  }));

  const rainNext = data.list.find((i: any) => i.weather[0].main === 'Rain');
  const frostEntry = data.list.find((i: any) => i.main.temp_min <= 32);

  return (
    <div className="weather-banner px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4 md:gap-8">
        <div className="flex items-center gap-4">
          {days.map((day) => (
            <div key={day.label} className="flex flex-col items-center gap-1 text-center" style={{ minWidth: "52px" }}>
              <span className="font-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "var(--sage)", textTransform: "uppercase" }}>{day.label}</span>
              <WeatherIcon type={day.icon} className="w-5 h-5" />
              <div className="flex gap-1 items-center" style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)" }}>
                <span style={{ color: "var(--cream)", fontWeight: 600 }}>{day.high}°</span>
                <span style={{ color: "var(--straw)" }}>/</span>
                <span style={{ color: "var(--straw)" }}>{day.low}°</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ width: "1px", height: "32px", background: "rgba(122,154,110,0.2)" }} className="hidden md:block" />

        {/* Updated Rain and Frost blocks with headers matching the Days */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="font-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "var(--sage)", textTransform: "uppercase" }}>Next Rain</span>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4" style={{ color: "var(--sky)" }} />
              <span className="font-mono text-[0.7rem]" style={{ color: "var(--cream)" }}>
                {rainNext ? new Date(rainNext.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Clear"}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <span className="font-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "var(--sage)", textTransform: "uppercase" }}>Frost Risk</span>
            <div className="flex items-center gap-1.5">
              <Snowflake className="w-4 h-4" style={{ color: "var(--frost)" }} />
              <span className="font-mono text-[0.7rem]" style={{ color: "var(--cream)" }}>
                {frostEntry ? new Date(frostEntry.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "None"}
              </span>
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 font-mono text-[0.7rem]" style={{ color: "var(--straw)" }}>
          <Wind size={14} /> {Math.round(current.wind.speed)} mph
        </div>
      </div>
    </div>
  );
}
