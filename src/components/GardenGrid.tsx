// components/GardenGrid.tsx
"use client";

import { useState } from "react";
import { Sprout, Star } from "lucide-react";
import { MOCK_PLOTS, Plot, Planting } from "@/lib/mockData";
import PlantingModal from "./PlantingModal";

interface Props {
  plantings: Planting[];
  onSave: (data: Partial<Planting>, duplicatePlotIds: string[]) => void;
}

const VEGE_EMOJI: Record<string, string> = {
  tomato: "🍅", basil: "🌿", pepper: "🫑", "bell pepper": "🫑",
  zucchini: "🥒", cucumber: "🥒", kale: "🥬", eggplant: "🍆",
  lettuce: "🥗", "pole beans": "🫘", carrot: "🥕",
  "swiss chard": "🌿", pumpkin: "🎃", marigold: "🌼",
  jalapeño: "🌶️",
};

function getEmoji(name: string): string {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(VEGE_EMOJI)) {
    if (key.includes(k)) return v;
  }
  return "🌱";
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          style={{
            width: "8px", height: "8px",
            fill: n <= rating ? "var(--gold)" : "transparent",
            color: n <= rating ? "var(--gold)" : "rgba(122,154,110,0.3)",
          }}
        />
      ))}
    </div>
  );
}

interface PlotCellProps {
  plot: Plot;
  planting?: Planting;
  index: number;
  onClick: () => void;
}

function PlotCell({ plot, planting, index, onClick }: PlotCellProps) {
  const [hovered, setHovered] = useState(false);

  if (plot.is_walkway) {
    return (
      <div
        className="rounded-sm"
        style={{
          background: "rgba(28,26,20,0.0)",
          border: "none",
        }}
      />
    );
  }

  const hasPlanting = !!planting;
  const delay = `${(index % 15) * 18 + Math.floor(index / 15) * 30}ms`;

  return (
    <div
      className="plot-cell rounded-lg cursor-pointer relative overflow-hidden flex flex-col items-center justify-center gap-0.5 transition-all"
      style={{
        animationDelay: delay,
        background: hasPlanting
          ? hovered
            ? "rgba(74,103,65,0.55)"
            : "rgba(58,74,46,0.4)"
          : hovered
          ? "rgba(58,74,46,0.35)"
          : "rgba(46,42,30,0.5)",
        border: hasPlanting
          ? `1px solid ${hovered ? "var(--sage)" : "rgba(122,154,110,0.45)"}`
          : `1px solid ${hovered ? "rgba(122,154,110,0.4)" : "rgba(122,154,110,0.15)"}`,
        transform: hovered ? "scale(1.04)" : "scale(1)",
        transition: "transform 0.15s ease, background 0.15s ease, border-color 0.15s ease",
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.35)" : "none",
        padding: "3px 2px",
        minHeight: 0,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={hasPlanting ? `${planting.vegetable_name}${planting.strain ? ` — ${planting.strain}` : ""}` : `Empty plot (R${plot.grid_row}·C${plot.grid_col})`}
    >
      {hasPlanting ? (
        <>
          <span style={{ fontSize: "clamp(10px, 1.5vw, 18px)", lineHeight: 1 }}>
            {getEmoji(planting.vegetable_name)}
          </span>
          <StarRating rating={planting.status_rating ?? 0} />
          <span
            className="font-mono truncate w-full text-center"
            style={{
              fontSize: "clamp(5px, 0.55vw, 8px)",
              color: "var(--mint)",
              letterSpacing: "0.02em",
              lineHeight: 1.2,
              maxWidth: "100%",
            }}
          >
            {planting.vegetable_name.slice(0, 8)}
          </span>
        </>
      ) : (
        <Sprout
          style={{
            width: "clamp(8px, 1.2vw, 14px)",
            height: "clamp(8px, 1.2vw, 14px)",
            color: "rgba(122,154,110,0.3)",
          }}
        />
      )}
    </div>
  );
}

export default function GardenGrid({ plantings, onSave }: Props) {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

  const plantingMap = new Map<string, Planting>();
  plantings.forEach((p) => plantingMap.set(p.plot_id, p));

  return (
    <>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ background: "rgba(58,74,46,0.4)", border: "1px solid rgba(122,154,110,0.45)" }}
          />
          <span style={{ fontSize: "0.72rem", color: "var(--straw)", fontFamily: "var(--font-mono)" }}>
            Planted
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ background: "rgba(46,42,30,0.5)", border: "1px solid rgba(122,154,110,0.15)" }}
          />
          <span style={{ fontSize: "0.72rem", color: "var(--straw)", fontFamily: "var(--font-mono)" }}>
            Empty (click to add)
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span style={{ fontSize: "0.72rem", color: "var(--sage)", fontFamily: "var(--font-mono)" }}>
            ← BACK ROW
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="garden-grid">
        {MOCK_PLOTS.map((plot, i) => (
          <PlotCell
            key={plot.id}
            plot={plot}
            planting={plantingMap.get(plot.id)}
            index={i}
            onClick={() => { if (!plot.is_walkway) setSelectedPlot(plot); }}
          />
        ))}
      </div>

      <div className="flex justify-center mt-2">
        <span style={{ fontSize: "0.72rem", color: "var(--sage)", fontFamily: "var(--font-mono)" }}>
          FRONT ROW (PATH) →
        </span>
      </div>

      {/* Row labels */}
      <div className="grid grid-cols-7 mt-2" style={{ fontSize: "0.6rem", color: "var(--straw)", fontFamily: "var(--font-mono)" }}>
        {["Row 1", "Row 2", "Row 3", "Row 4", "Row 5", "Row 6", "Row 7"].map((r) => (
          <span key={r} className="text-center">{r}</span>
        ))}
      </div>

      {/* Modal */}
      {selectedPlot && (
        <PlantingModal
          plot={selectedPlot}
          existingPlanting={plantingMap.get(selectedPlot.id)}
          onClose={() => setSelectedPlot(null)}
          onSave={(data, dupes) => {
            onSave(data, dupes);
            setSelectedPlot(null);
          }}
        />
      )}
    </>
  );
}
