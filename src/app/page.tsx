// app/page.tsx
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
        year:              data.year ?? 2025,
        vegetable_name:    data.vegetable_name ?? "",
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

  const currentYearPlantings = plantings.filter((p) => p.year === 2025);
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
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between" style={{ height: "56px" }}>
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
                Season 2025
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center" style={{ borderBottom: "1px solid rgba(122,154,110,0.15)" }}>
            <button
              className={`nav-tab flex items-center gap-2 ${activeTab === "garden" ? "active" : ""}`}
              onClick={() => setActiveTab("garden")}
            >
              <Sprout className="w-4 h-4" />
              Garden View
            </button>
            <button
              className={`nav-tab flex items-center gap-2 ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              <Database className="w-4 h-4" />
              Historical Database
            </button>
          </div>

          {/* Stats pill */}
          <div
            className="hidden md:flex items-center gap-2 rounded-full px-3 py-1.5"
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
            {plantedCount}/{totalPlots} plots planted
          </div>
        </div>
      </nav>

      {/* ── Weather Banner ───────────────────────────────────── */}
      <WeatherBanner />

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">

        {activeTab === "garden" && (
          <div>
            {/* Section Header */}
            <div className="mb-6">
              <h1
                className="font-display"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--cream)", lineHeight: 1.2 }}
              >
                Garden <span style={{ fontStyle: "italic", color: "var(--sage)" }}>Plot Map</span>
              </h1>
              <p style={{ fontSize: "0.8rem", color: "var(--straw)", marginTop: "4px" }}>
                Click any plot to add or edit a planting. Walkways are shown as empty spaces.
              </p>
            </div>

            <GardenGrid
              plantings={currentYearPlantings}
              onSave={handleSave}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
              {[
                { label: "Total Plots",    value: totalPlots,                              color: "var(--sage)"  },
                { label: "Planted",        value: plantedCount,                            color: "var(--mint)"  },
                { label: "Empty",          value: totalPlots - plantedCount,               color: "var(--straw)" },
                { label: "Avg Rating",     value: currentYearPlantings.length
                    ? (currentYearPlantings.reduce((s, p) => s + (p.status_rating ?? 0), 0) / currentYearPlantings.length).toFixed(1)
                    : "—",                                                                  color: "var(--gold)"  },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="rounded-xl p-4"
                  style={{ background: "rgba(46,42,30,0.6)", border: "1px solid rgba(122,154,110,0.15)" }}
                >
                  <div className="font-mono" style={{ fontSize: "0.6rem", color: "var(--sage)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>
                    {label}
                  </div>
                  <div className="font-display" style={{ fontSize: "1.75rem", color, lineHeight: 1 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div>
            {/* Section Header */}
            <div className="mb-6">
              <h1
                className="font-display"
                style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "var(--cream)", lineHeight: 1.2 }}
              >
                Historical <span style={{ fontStyle: "italic", color: "var(--sage)" }}>Database</span>
              </h1>
              <p style={{ fontSize: "0.8rem", color: "var(--straw)", marginTop: "4px" }}>
                Browse, filter, and edit all plantings across every season.
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
        className="text-center py-4"
        style={{
          borderTop: "1px solid rgba(122,154,110,0.12)",
          fontSize: "0.65rem",
          color: "rgba(212,196,154,0.4)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.08em",
        }}
      >
        GARDEN DASHBOARD · SEASON 2025 · BUILT WITH NEXT.JS + SUPABASE
      </footer>
    </div>
  );
}
