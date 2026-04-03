"use client";

import { useState, useCallback, useMemo } from "react";
import { Leaf, Database, Sprout, ChevronDown, Activity } from "lucide-react";
import WeatherBanner from "@/components/WeatherBanner";
import GardenGrid from "@/components/GardenGrid";
import HistoricalDatabase from "@/components/HistoricalDatabase";
import { MOCK_PLANTINGS, Planting, MOCK_PLOTS } from "@/lib/mockData";

type Tab = "garden" | "history";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("garden");
  const [currentYear, setCurrentYear] = useState(2026);
  const [plantings, setPlantings] = useState<Planting[]>(MOCK_PLANTINGS);

  // Generates the range from 2024 to 2030
  const availableYears = useMemo(() => [2030, 2029, 2028, 2027, 2026, 2025, 2024], []);

  // Handler: Save new/updated planting + optional duplicates
  const handleSave = useCallback(
    (data: Partial<Planting>, duplicatePlotIds: string[]) => {
      const now = new Date().toISOString();

      const newEntry: Planting = {
        id:                data.id ?? `planting-${Date.now()}`,
        plot_id:           data.plot_id!,
        year:              currentYear, // Locked to the currently selected season
        vegetable_name:    data.vegetable_name ?? "",
        emoji:             data.emoji,
        category:          data.category,
        strain:            data.strain,
        seed_source:       data.seed_source,
        started_from:      data.started_from ?? "seed",
        seed_plant_date:   data.seed_plant_date,
        garden_plant_date: data.garden_plant_date ?? now.split("T")[0],
        status_rating:     data.status_rating ?? 3,
        notes:             data.notes,
        will_plant_again:  data.will_plant_again ?? true,
        image_url:         data.image_url,
      };

      // Build duplicate entries for multi-plot planting
      const dupeEntries: Planting[] = duplicatePlotIds.map((pid, i) => ({
        ...newEntry,
        id: `planting-dupe-${Date.now()}-${i}`,
        plot_id: pid,
      }));

      setPlantings((prev) => {
        // Remove existing entries for these plots in the current year to avoid overlaps
        const filtered = prev.filter(
          (p) =>
            !(p.plot_id === newEntry.plot_id && p.year === currentYear) &&
            !duplicatePlotIds.some((pid) => p.plot_id === pid && p.year === currentYear)
        );
        return [...filtered, newEntry, ...dupeEntries];
      });
    },
    [currentYear]
  );

  // Handler: Update specific fields (Rating, Notes, etc)
  const handleUpdate = useCallback((id: string, updates: Partial<Planting>) => {
    setPlantings((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  // Filter logic for the dashboard stats
  const currentYearPlantings = plantings.filter((p) => p.year === currentYear);
  const totalPlots = MOCK_PLOTS.filter((p) => !p.is_walkway).length;
  const plantedCount = new Set(currentYearPlantings.map((p) => p.plot_id)).size;

  return (
    <div className="min-h-screen flex flex-col bg-[#1c1a14] text-[#f5f2e9]">
      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 bg-[#1c1a14]/95 backdrop-blur-md border-b border-[#7a9a6e]/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo & Year Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4a6741] flex items-center justify-center border border-[#7a9a6e]/40 shadow-inner">
                <Leaf className="w-4 h-4 text-[#a3e635]" />
              </div>
              <div className="hidden sm:block">
                <div className="font-display text-sm leading-tight text-[#f5f2e9]">Garden Dashboard</div>
                <div className="text-[10px] font-mono text-[#7a9a6e] uppercase tracking-widest">Bedford Station</div>
              </div>
            </div>

            {/* THE YEAR SWITCHER */}
            <div className="relative group">
              <select 
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="appearance-none bg-[#4a6741]/20 border border-[#7a9a6e]/30 rounded-md px-3 py-1.5 pr-9 font-mono text-[11px] text-[#a3e635] focus:outline-none cursor-pointer hover:border-[#a3e635]/50 transition-all outline-none"
              >
                {availableYears.map(y => (
                  <option key={y} value={y} className="bg-[#1c1a14] text-[#f5f2e9]">
                    SEASON {y}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-[#7a9a6e] pointer-events-none group-hover:text-[#a3e635] transition-colors" />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("garden")}
              className={`px-4 py-2 text-[11px] font-mono rounded-t-lg transition-all ${
                activeTab === "garden" 
                  ? "text-[#a3e635] border-b-2 border-[#a3e635] bg-white/5" 
                  : "text-[#7a9a6e]/60 hover:text-[#7a9a6e]"
              }`}
            >
              GARDEN VIEW
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 text-[11px] font-mono rounded-t-lg transition-all ${
                activeTab === "history" 
                  ? "text-[#a3e635] border-b-2 border-[#a3e635] bg-white/5" 
                  : "text-[#7a9a6e]/60 hover:text-[#7a9a6e]"
              }`}
            >
              HISTORY
            </button>
          </div>

          {/* Real-time Status Pill */}
          <div className="hidden lg:flex items-center gap-2.5 rounded-full px-4 py-1.5 bg-[#4a6741]/10 border border-[#7a9a6e]/20 shadow-sm">
            <Activity size={12} className="text-[#a3e635] animate-pulse" />
            <span className="text-[10px] font-mono text-[#a3e635] uppercase tracking-tighter">
              {plantedCount} / {totalPlots} PLOTS ACTIVE
            </span>
          </div>
        </div>
      </nav>

      {/* ── Weather Engine ── */}
      <WeatherBanner />

      {/* ── Main Dashboard ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {activeTab === "garden" ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Context Header */}
            <div className="mb-8 text-center sm:text-left border-l-2 border-[#7a9a6e]/20 pl-6">
              <h1 className="font-display text-3xl text-[#f5f2e9] leading-none">
                Bedford <span className="italic text-[#7a9a6e]">Plot Map</span>
              </h1>
              <p className="text-[11px] font-mono text-[#7a9a6e] uppercase tracking-[0.2em] mt-3">
                Strategic planting layout for the {currentYear} growing season
              </p>
            </div>

            <GardenGrid 
              plantings={currentYearPlantings} 
              onSave={handleSave} 
            />

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
              {[
                { label: "Season Capacity", value: totalPlots, color: "#7a9a6e" },
                { label: "Total Plantings", value: plantedCount, color: "#a3e635" },
                { label: "Available Space", value: totalPlots - plantedCount, color: "#d4c49a" },
                { label: "Plot Rating", value: currentYearPlantings.length 
                    ? (currentYearPlantings.reduce((s, p) => s + (p.status_rating ?? 0), 0) / currentYearPlantings.length).toFixed(1)
                    : "0.0", color: "#d4c49a" }
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-[#2e2a1e]/60 border border-[#7a9a6e]/15 rounded-2xl p-5 shadow-xl">
                  <div className="text-[9px] font-mono text-[#7a9a6e] uppercase tracking-widest mb-2">{label}</div>
                  <div className="text-3xl font-display" style={{ color }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            <div className="mb-6">
              <h1 className="font-display text-2xl text-[#f5f2e9]">Garden <span className="italic text-[#7a9a6e]">Archives</span></h1>
              <p className="text-xs text-[#d4c49a]/60 mt-1">Cross-referencing performance data from 2024–2030</p>
            </div>
            <HistoricalDatabase plantings={plantings} onUpdate={handleUpdate} />
          </div>
        )}
      </main>

      {/* ── Dashboard Footer ── */}
      <footer className="py-8 mt-12 border-t border-[#7a9a6e]/10 text-center">
        <div className="text-[10px] font-mono text-[#7a9a6e]/40 uppercase tracking-[0.25em]">
          Garden Tracker V3.2 • Season {currentYear} • Bedford Station
        </div>
      </footer>
    </div>
  );
}
