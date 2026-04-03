// components/WeatherBanner.tsx
"use client";

import { Sun, Cloud, CloudRain, Snowflake, Droplets, Wind } from "lucide-react";

interface ForecastDay {
  label: string;
  icon: "sun" | "cloud" | "rain";
  high: number;
  low: number;
}

const FORECAST: ForecastDay[] = [
  { label: "Today",    icon: "sun",   high: 78, low: 58 },
  { label: "Tomorrow", icon: "cloud", high: 72, low: 55 },
  { label: "Wed",      icon: "rain",  high: 65, low: 52 },
];

const NEXT_RAIN  = "Wednesday, Jun 4";
const NEXT_FROST = "October 15 (est.)";

function WeatherIcon({ type }: { type: ForecastDay["icon"] }) {
  const cls = "w-6 h-6";
  if (type === "sun")   return <Sun   className={cls} style={{ color: "var(--gold)" }} />;
  if (type === "rain")  return <CloudRain className={cls} style={{ color: "var(--sky)" }} />;
  return <Cloud className={cls} style={{ color: "var(--straw)" }} />;
}

export default function WeatherBanner() {
  return (
    <div className="weather-banner px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4 md:gap-8">

        {/* 3-day forecast */}
        <div className="flex items-center gap-4">
          {FORECAST.map((day) => (
            <div
              key={day.label}
              className="flex flex-col items-center gap-1 text-center"
              style={{ minWidth: "52px" }}
            >
              <span
                className="font-mono"
                style={{ fontSize: "0.6rem", letterSpacing: "0.1em", color: "var(--sage)", textTransform: "uppercase" }}
              >
                {day.label}
              </span>
              <WeatherIcon type={day.icon} />
              <div
                className="flex gap-1 items-center"
                style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)" }}
              >
                <span style={{ color: "var(--cream)", fontWeight: 600 }}>{day.high}°</span>
                <span style={{ color: "var(--straw)" }}>/</span>
                <span style={{ color: "var(--straw)" }}>{day.low}°</span>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "36px", background: "rgba(122,154,110,0.3)" }} className="hidden md:block" />

        {/* Rain */}
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 flex-shrink-0" style={{ color: "var(--sky)" }} />
          <div>
            <div style={{ fontSize: "0.6rem", color: "var(--sage)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
              Next Rain
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--cream)", fontWeight: 500 }}>
              {NEXT_RAIN}
            </div>
          </div>
        </div>

        {/* Frost */}
        <div className="flex items-center gap-2">
          <Snowflake className="w-4 h-4 flex-shrink-0" style={{ color: "var(--frost)" }} />
          <div>
            <div style={{ fontSize: "0.6rem", color: "var(--sage)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
              Next Frost
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--cream)", fontWeight: 500 }}>
              {NEXT_FROST}
            </div>
          </div>
        </div>

        {/* Wind */}
        <div className="flex items-center gap-2 ml-auto">
          <Wind className="w-4 h-4 flex-shrink-0" style={{ color: "var(--straw)" }} />
          <span style={{ fontSize: "0.78rem", color: "var(--straw)", fontFamily: "var(--font-mono)" }}>
            SW 8 mph
          </span>
        </div>

      </div>
    </div>
  );
}
