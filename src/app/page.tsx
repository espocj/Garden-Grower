"use client";

import { useState, useCallback, useMemo } from "react";
import { Leaf, ChevronDown } from "lucide-react";
import WeatherBanner from "@/components/WeatherBanner";
import GardenGrid from "@/components/GardenGrid";
import HistoricalDatabase from "@/components/HistoricalDatabase";
import { MOCK_PLANTINGS, Planting, MOCK_PLOTS } from "@/lib/mockData";

type Tab = "garden" | "history";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("garden");
  const [currentYear, setCurrentYear] = useState(2026);
  const [plantings, setPlantings] = useState<Planting[]>(MOCK_PLANTINGS);

  const availableYears = useMemo(() => [2030, 2029, 2028, 2027, 2026, 2025, 2024], []);

  const handleSave = useCallback((data: Partial<Planting>) => {
    const newEntry: Planting = {
      ...data,
      id: data.id ?? `planting-${Date.now()}`,
      year: currentYear,
      plot_ids: data.plot_ids || [], // Saving the array natively
      vegetable_name: data.vegetable_name ?? "",
      garden_plant_date: data.garden_plant_date ?? new Date().toISOString().split("T")[0],
      status_rating: data.status_rating ?? 3,
      started_from: data.started_from ?? "seed",
      will_plant_again: data.will_plant_again ?? true,
    } as Planting;

    setPlantings((prev) => {
      // Remove the old entry if editing, then add the new state
      const filtered = prev.filter(p => p.id !== newEntry.id);
      return [...filtered, newEntry];
    });
  }, [currentYear]);

  const handleUpdate = useCallback((id: string, updates: Partial<Planting>) => {
    setPlantings((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const currentYearPlantings = plantings.filter((p) => p.year === currentYear);
  const totalPlots = MOCK_PLOTS.filter((p) => !p.is_walkway).length;
  // Calculate total individual plots occupied by flattening the arrays
  const plantedCount = new Set(currentYearPlantings.flatMap(p => p.plot_ids)).size;

  return (
    <div className="min-h-screen flex flex-col bg-[#c4b396] text-[#2d241e]">
      <nav className="sticky top-0 z-50 bg-[#c4b396]/95 backdrop-blur-md border-b border-[#3e2723]/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#3e2723] flex items-center justify-center shadow-md">
                <Leaf className="w-4 h-4 text-[#94a77e]" />
              </div>
              <div className="hidden sm:block">
                <div className="font-display text-sm font-bold text-[#3e2723]">Garden Dashboard</div>
                <div className="text-[10px] font-mono text-[#3e2723]/60 uppercase tracking-widest leading-none">Bedford Station</div>
              </div>
            </div>

            <div className="relative">
              <select 
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="appearance-none bg-[#3e2723]/10 border border-[#3e2723]/20 rounded-md px-3 py-1.5 pr-9 font-mono text-[11px] text-[#3e2723] font-bold focus:outline-none cursor-pointer outline-none"
              >
                {availableYears.map(y => <option key={y} value={y} className="bg-[#c4b396]">SEASON {y}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-[#3e2723]/40 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => setActiveTab("garden")} className={`px-4 py-2 text-[11px] font-mono tracking-widest transition-all ${activeTab === "garden" ? "text-[#3e2723] border-b-2 border-[#3e2723]" : "text-[#3e2723]/40 hover:text-[#3e2723]"}`}>
              GARDEN VIEW
            </button>
            <button onClick={() => setActiveTab("history")} className={`px-4 py-2 text-[11px] font-mono tracking-widest transition-all ${activeTab === "history" ? "text-[#3e2723] border-b-2 border-[#3e2723]" : "text-[#3e2723]/40 hover:text-[#3e2723]"}`}>
              HISTORY
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-[#3e2723] font-bold bg-[#3e2723]/5 rounded-full px-4 py-1.5 border border-[#3e2723]/10">
            {plantedCount} / {totalPlots} PLOTS
          </div>
        </div>
      </nav>

      <WeatherBanner />

      <main className="flex-1 w-full max-w-full mx-auto px-4 py-6">
        {activeTab === "garden" ? (
          <GardenGrid plantings={currentYearPlantings} onSave={handleSave} />
        ) : (
          <HistoricalDatabase plantings={plantings} onUpdate={handleUpdate} />
        )}
      </main>

      <footer className="py-8 text-center text-[10px] font-mono text-[#3e2723]/30 uppercase tracking-[0.3em] border-t border-[#3e2723]/5">
        Bedford Garden Tracker • Season {currentYear}
      </footer>
    </div>
  );
}
