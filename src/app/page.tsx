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

  const availableYears = useMemo(() => [2030, 2029, 2028, 2027, 2026, 2025, 2024], []);

  const handleSave = useCallback((data: Partial<Planting>, duplicatePlotIds: string[]) => {
     // ... (Existing Save Logic)
  }, [currentYear]);

  const currentYearPlantings = plantings.filter((p) => p.year === currentYear);
  const totalPlots = MOCK_PLOTS.filter((p) => !p.is_walkway).length;
  const plantedCount = new Set(currentYearPlantings.map((p) => p.plot_id)).size;

  return (
    <div className="min-h-screen flex flex-col bg-[#1c1a14] text-[#f5f2e9]">
      <nav className="sticky top-0 z-50 bg-[#1c1a14]/90 backdrop-blur-md border-b border-[#7a9a6e]/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#4a6741] flex items-center justify-center border border-[#7a9a6e]/40">
                <Leaf className="w-4 h-4 text-[#a3e635]" />
              </div>
              <div className="font-display text-sm">Garden Dashboard</div>
            </div>

            <div className="relative">
              <select 
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="appearance-none bg-[#4a6741]/20 border border-[#7a9a6e]/30 rounded-md px-3 py-1.5 pr-9 font-mono text-[11px] text-[#a3e635] focus:outline-none cursor-pointer outline-none"
              >
                {availableYears.map(y => <option key={y} value={y} className="bg-[#1c1a14]">SEASON {y}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-[#7a9a6e] pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => setActiveTab("garden")} className={`px-4 py-2 text-[11px] font-mono tracking-widest transition-all ${activeTab === "garden" ? "text-[#a3e635] border-b-2 border-[#a3e635] bg-white/5" : "text-[#7a9a6e]/60 hover:text-[#7a9a6e]"}`}>
              GARDEN VIEW
            </button>
            <button onClick={() => setActiveTab("history")} className={`px-4 py-2 text-[11px] font-mono tracking-widest transition-all ${activeTab === "history" ? "text-[#a3e635] border-b-2 border-[#a3e635] bg-white/5" : "text-[#7a9a6e]/60 hover:text-[#7a9a6e]"}`}>
              HISTORY
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono text-[#a3e635] border border-[#7a9a6e]/20 rounded-full px-4 py-1 bg-[#4a6741]/10">
            <Activity size={10} className="animate-pulse" /> {plantedCount} / {totalPlots} PLOTS
          </div>
        </div>
      </nav>

      <WeatherBanner />

      <main className="flex-1 w-full max-w-full mx-auto px-4 py-6">
        {activeTab === "garden" ? (
          <GardenGrid plantings={currentYearPlantings} onSave={() => {}} />
        ) : (
          <HistoricalDatabase plantings={plantings} onUpdate={() => {}} />
        )}
      </main>

      <footer className="py-8 text-center text-[10px] font-mono text-[#7a9a6e]/40 uppercase tracking-[0.25em] border-t border-[#7a9a6e]/10">
        Garden Tracker V3.5 • Bedford Station • {currentYear}
      </footer>
    </div>
  );
}
