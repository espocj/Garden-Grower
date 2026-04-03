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
    // ... (Keep your existing handleSave logic)
  }, [currentYear]);

  const currentYearPlantings = plantings.filter((p) => p.year === currentYear);
  const totalPlots = MOCK_PLOTS.filter((p) => !p.is_walkway).length;
  const plantedCount = new Set(currentYearPlantings.map((p) => p.plot_id)).size;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-[#45322e]">
      {/* ── Navigation (Heritage Style) ── */}
      <nav className="sticky top-0 z-50 bg-[#f4ece2]/80 backdrop-blur-md border-b border-[#d4c49a]">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#8c7851] flex items-center justify-center shadow-sm">
                <Leaf className="w-4 h-4 text-[#fdfbf7]" />
              </div>
              <div className="font-display text-sm font-semibold text-[#45322e]">Garden Dashboard</div>
            </div>

            <div className="relative">
              <select 
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="appearance-none bg-[#e8decb] border border-[#d4c49a] rounded px-3 py-1 pr-8 font-mono text-[11px] text-[#45322e] focus:outline-none cursor-pointer"
              >
                {availableYears.map(y => <option key={y} value={y}>SEASON {y}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-2.5 text-[#8c7851] pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => setActiveTab("garden")} className={`px-4 py-2 text-[10px] font-mono tracking-widest transition-all ${activeTab === "garden" ? "text-[#8c7851] border-b-2 border-[#8c7851]" : "text-[#a69177]"}`}>
              GARDEN VIEW
            </button>
            <button onClick={() => setActiveTab("history")} className={`px-4 py-2 text-[10px] font-mono tracking-widest transition-all ${activeTab === "history" ? "text-[#8c7851] border-b-2 border-[#8c7851]" : "text-[#a69177]"}`}>
              HISTORY
            </button>
          </div>

          <div className="hidden lg:block text-[10px] font-mono text-[#8c7851] bg-[#e8decb] px-3 py-1 rounded border border-[#d4c49a]">
            {plantedCount} / {totalPlots} PLOTS
          </div>
        </div>
      </nav>

      <WeatherBanner />

      <main className="flex-1 w-full max-w-full mx-auto px-2 py-4">
        {activeTab === "garden" ? (
          <div className="flex flex-col items-center">
            {/* The headers are removed, going straight to the Grid */}
            <GardenGrid plantings={currentYearPlantings} onSave={() => {}} />

            {/* Brighter Summary Cards */}
            <div className="grid grid-cols-4 gap-4 w-full max-w-6xl mt-8 px-4">
              {[
                { label: "Crops", value: plantedCount },
                { label: "Open", value: totalPlots - plantedCount },
                { label: "Capacity", value: totalPlots },
                { label: "Rating", value: "4.8" }
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#f4ece2] border border-[#d4c49a] rounded-xl p-4 text-center">
                  <div className="text-[9px] font-mono text-[#a69177] uppercase tracking-widest mb-1">{label}</div>
                  <div className="text-2xl font-display text-[#45322e]">{value}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <HistoricalDatabase plantings={plantings} onUpdate={() => {}} />
        )}
      </main>

      <footer className="py-6 text-center text-[9px] font-mono text-[#a69177] uppercase tracking-[0.3em]">
        Linen & Earth • Bedford Station • {currentYear}
      </footer>
    </div>
  );
}
