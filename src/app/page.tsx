"use client";

import { useState, useCallback } from "react";
import { Leaf, Database, Sprout } from "lucide-react";
import WeatherBanner from "@/components/WeatherBanner";
import GardenGrid from "@/components/GardenGrid";
import HistoricalDatabase from "@/components/HistoricalDatabase";
import { MOCK_PLANTINGS, Planting, MOCK_PLOTS } from "@/lib/mockData";

type Tab = "garden" | "history";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("garden");
  const [plantings, setPlantings] = useState<Planting[]>(MOCK_PLANTINGS);

  // Handler: save new/updated planting + optional duplicates
  const handleSave = useCallback(
    (data: Partial<Planting>, duplicatePlotIds: string[]) => {
      const now = new Date().toISOString();

      const newEntry: Planting = {
        id:                data.id ?? `planting-${Date.now()}`,
        plot_id:           data.plot_id!,
        year:              data.year ?? 2026, // Updated to 2026
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

      // Build duplicate entries
      const dupeEntries: Planting[] = duplicatePlotIds.map((pid, i) => ({
        ...newEntry,
        id: `planting-dupe-${Date.now()}-${i}`,
        plot_id: pid,
      }));

      setPlantings((prev) => {
        // Remove any existing same plot+year entry, then add new ones
        const filtered = prev.filter(
          (p) =>
            !(p.plot_id === newEntry.plot_id && p.year === newEntry.year) &&
            !duplicatePlotIds.some((pid) => p.plot_id === pid && p.year === newEntry.year)
        );
        return [...filtered, newEntry, ...dupeEntries];
      });
    },
    []
  );

  // Handler: update a planting field (e.g. will_plant_again toggle)
  const handleUpdate = useCallback((id: string, updates: Partial<Planting>) => {
    setPlantings((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  // Updated filter for 2026
  const currentYearPlantings = plantings.filter((p) => p.year === 2026);
  const totalPlots = MOCK_PLOTS.filter((p) => !p.is_walkway).length;
  const plantedCount = new Set(currentYearPlantings.map((p) => p.plot_id)).size;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav
        style={{
          background: "rgba(28,26,20,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(122,154,110,0.2)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between" style={{ height: "64px" }}>
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="rounded-lg flex items-center justify-center"
              style={{ width: "32px", height: "32px", background: "var(--moss)", border: "1px solid rgba(122,154,110,0.4)" }}
            >
              <Leaf className="w-4 h-4" style={{ color: "var(--mint)" }} />
            </div>
            <div>
              <div className="font-display" style={{ fontSize: "1rem", color: "var(--cream)", lineHeight: 1.1 }}>
                Garden<span style={{ color: "var(--sage)" }}>Dashboard</span>
              </div>
              <div className="font-mono" style={{ fontSize: "0.55rem", color: "var(--straw)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Season 2026
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1">
            <button
              className={`nav-tab px-4 py-2 flex items-center gap-2 rounded-t-lg transition-all ${activeTab === "garden" ? "text-mint border-b-2 border-mint bg-white/5" : "text-sage/60 hover:text-sage"}`}
              onClick={() => setActiveTab("garden")}
              style={{ fontSize: "0.85rem" }}
            >
              <Sprout className="w-4 h-4" />
              <span className="hidden sm:inline">Garden View</span>
            </button>
            <button
              className={`nav-tab px-4 py-2 flex items-center gap-2 rounded-t-lg transition-all ${activeTab === "history" ? "text-mint border-b-2 border-mint bg-white/5" : "text-sage/60 hover:text-sage"}`}
              onClick={() => setActiveTab("history")}
              style={{ fontSize: "0.85rem" }}
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Historical Database</span>
            </button>
          </div>

          {/* Stats pill */}
          <div
            className="hidden md:flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{
              background: "rgba(74,103,65,0.2)",
              border: "1px solid rgba(122,154,110,0.25)",
              fontSize: "0.72rem",
              fontFamily: "var(--font-mono)",
              color: "var(--mint)",
            }}
          >
            <div
              className="rounded-full"
              style={{ width: "7px", height: "7px", background: "var(--sage)", animation: "pulse 2s infinite" }}
            />
            {plantedCount}/{totalPlots} PLOTS
          </div>
        </div>
      </nav>

      {/* ── Weather Banner ───────────────────────────────────── */}
      <WeatherBanner />

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 overflow-x-hidden">

        {activeTab === "garden" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Section Header */}
            <div className="mb-8 text-center sm:text-left">
              <h1
                className="font-display"
                style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "var(--cream)", lineHeight: 1.2 }}
              >
                Bedford <span style={{ fontStyle: "italic", color: "var(--sage)" }}>Plot Map</span>
              </h1>
              <p style={{ fontSize: "0.85rem", color: "var(--straw)", marginTop: "6px" }}>
                Interactive grid for the 2026 Season. Tap any square to manage your crop.
              </p>
            </div>

            <GardenGrid
              plantings={currentYearPlantings}
              onSave={handleSave}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
              {[
                { label: "Total Capacity", value: totalPlots,                              color: "var(--sage)"  },
                { label: "Active Crops",   value: plantedCount,                            color: "var(--mint)"  },
                { label: "Open Space",     value: totalPlots - plantedCount,               color: "var(--straw)" },
                { label: "Season Health",  value: currentYearPlantings.length
                    ? (currentYearPlantings.reduce((s, p) => s + (p.status_rating ?? 0), 0) / currentYearPlantings.length).toFixed(1)
                    : "—",                                                                  color: "var(--gold)"  },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="rounded-2xl p-5 shadow-lg shadow-black/20"
                  style={{ background: "rgba(46,42,30,0.6)", border: "1px solid rgba(122,154,110,0.15)" }}
                >
                  <div className="font-mono" style={{ fontSize: "0.6rem", color: "var(--sage)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>
                    {label}
                  </div>
                  <div className="font-display" style={{ fontSize: "2rem", color, lineHeight: 1 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="animate-in fade-in duration-500">
            {/* Section Header */}
            <div className="mb-6">
              <h1
                className="font-display"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--cream)", lineHeight: 1.2 }}
              >
                Garden <span style={{ fontStyle: "italic", color: "var(--sage)" }}>Archives</span>
              </h1>
              <p style={{ fontSize: "0.8rem", color: "var(--straw)", marginTop: "4px" }}>
                Full records including notes and ratings from previous growing seasons.
              </p>
            </div>

            <HistoricalDatabase
              plantings={plantings}
              onUpdate={handleUpdate}
            />
          </div>
        )}
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer
        className="text-center py-6 mt-12"
        style={{
          borderTop: "1px solid rgba(122,154,110,0.12)",
          fontSize: "0.65rem",
          color: "rgba(212,196,154,0.3)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.1em",
        }}
      >
        BEDFORD GARDEN TRACKER · SEASON 2026 · BUILT FOR DAD
      </footer>
    </div>
  );
}
