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
};

function getEmoji(name: string, savedEmoji?: string): string {
  if (savedEmoji) return savedEmoji;
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
            color: n <= rating ? "var(--gold)" : "rgba(122,154,110,0.2)",
          }}
        />
      ))}
    </div>
  );
}

function PlotCell({ plot, planting, index, onClick }: { plot: Plot; planting?: Planting; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  if (plot.is_walkway) {
    return <div className="rounded-sm bg-transparent border-none" />;
  }

  const hasPlanting = !!planting;
  const delay = `${(index % 15) * 15}ms`;

  return (
    <div
      className="plot-cell rounded-lg cursor-pointer relative overflow-hidden flex flex-col items-center justify-center gap-1 transition-all"
      style={{
        animationDelay: delay,
        background: hasPlanting
          ? hovered ? "rgba(74,103,65,0.55)" : "rgba(58,74,46,0.4)"
          : hovered ? "rgba(58,74,46,0.35)" : "rgba(46,42,30,0.5)",
        border: hasPlanting
          ? `1px solid ${hovered ? "var(--sage)" : "rgba(122,154,110,0.45)"}`
          : `1px solid ${hovered ? "rgba(122,154,110,0.4)" : "rgba(122,154,110,0.15)"}`,
        transform: hovered ? "scale(1.04)" : "scale(1)",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.4)" : "none",
        padding: "6px 2px",
        minWidth: "60px",
        minHeight: "85px",
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hasPlanting ? (
        <>
          <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>
            {getEmoji(planting.vegetable_name, planting.emoji)}
          </span>
          <StarRating rating={planting.status_rating ?? 0} />
          <span
            className="font-mono text-center px-1"
            style={{
              fontSize: "0.6rem",
              color: "var(--mint)",
              letterSpacing: "0.02em",
              lineHeight: 1.1,
              wordBreak: "break-word",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {planting.vegetable_name}
          </span>
        </>
      ) : (
        <Sprout style={{ width: "12px", height: "12px", color: "rgba(122,154,110,0.25)" }} />
      )}
    </div>
  );
}

export default function GardenGrid({ plantings, onSave }: Props) {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

  const plantingMap = new Map<string, Planting>();
  plantings.forEach((p) => plantingMap.set(p.plot_id, p));

  return (
    <div className="w-full">
      {/* Legend - Restored Original Style */}
      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: "rgba(58,74,46,0.4)", border: "1px solid rgba(122,154,110,0.45)" }} />
          <span className="text-[0.7rem] font-mono text-straw uppercase tracking-widest">Planted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: "rgba(46,42,30,0.5)", border: "1px solid rgba(122,154,110,0.15)" }} />
          <span className="text-[0.7rem] font-mono text-straw uppercase tracking-widest">Empty</span>
        </div>
        <div className="ml-auto text-[0.7rem] font-mono text-sage/40 uppercase tracking-widest">
          ← Back Row (Bedford)
        </div>
      </div>

      {/* Grid - Original Proportions with 15-Cols */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        <div 
          className="grid gap-2"
          style={{ 
            gridTemplateColumns: 'repeat(15, minmax(70px, 1fr))',
            minWidth: '1050px' // Ensures it looks "original" even on small screens
          }}
        >
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
      </div>

      <div className="flex justify-between items-center mt-4 font-mono text-[0.65rem] text-sage/40 uppercase tracking-widest">
        <span>Front Path →</span>
        <div className="flex gap-4">
           {[1,2,3,4,5,6,7].map(r => <span key={r}>Row {r}</span>)}
        </div>
      </div>

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
    </div>
  );
}
