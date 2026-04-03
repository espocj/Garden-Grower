"use client";

import React, { useEffect, useState } from 'react';
import { CloudRain, Sun, Cloud, Thermometer, Wind, Snowflake } from 'lucide-react';

export default function WeatherBanner() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error("Weather failed to fetch", err);
      } finally {
        setLoading(false);
      }
    };

    // Try GPS first, fallback to Bedford, NY 10506
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(41.2043, -73.6438) // Bedford Coordinates
    );
  }, []);

  if (loading) return <div className="p-4 bg-cream/50 animate-pulse rounded-xl font-display text-soil/50">Checking the Bedford skies...</div>;
  if (!weather) return null;

  const current = weather.list[0];
  const isFrostRisk = current.main.temp_min <= 32;

  return (
    <div className="bg-white/80 backdrop-blur-md border border-mint/20 rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gold/10 rounded-full text-gold">
          {current.weather[0].main === 'Rain' ? <CloudRain size={32} /> : <Sun size={32} />}
        </div>
        <div>
          <h2 className="text-3xl font-display text-soil">{Math.round(current.main.temp)}°F</h2>
          <p className="text-fern capitalize font-medium">{current.weather[0].description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 text-sm">
        <div className="flex items-center gap-2 text-soil/70 font-sans">
          <Wind size={16} className="text-sky" />
          <span>{Math.round(current.wind.speed)} mph wind</span>
        </div>
        <div className="flex items-center gap-2 text-soil/70 font-sans">
          <CloudRain size={16} className="text-storm" />
          <span>{Math.round(current.pop * 100)}% rain</span>
        </div>
        {isFrostRisk && (
          <div className="col-span-2 flex items-center gap-2 text-rust font-bold animate-pulse">
            <Snowflake size={16} />
            <span>FROST ALERT: Protect the seedlings!</span>
          </div>
        )}
      </div>
    </div>
  );
}
