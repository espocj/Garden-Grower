"use client";

import React, { useState } from "react";
import { Sprout, Star } from "lucide-react";
import { MOCK_PLOTS, Plot, Planting } from "@/lib/mockData";
import PlantingModal from "./PlantingModal";

interface Props {
  plantings: Planting[];
  onSave: (data: Partial<Planting>, duplicatePlotIds: string[]) => void;
}

const VEGE_EMOJI: Record<string, string> = {
  tomato: "🍅", basil: "🌿", pepper: "🫑", zucchini: "🥒", kale: "🥬"
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} style={{ width: "8px", height: "8px", fill: n <= rating ? "#d4c49a" : "transparent", color: n <= rating ? "#d4c49a" : "rgba(122,154,110,0.15)" }} />
      ))}
    </div>
  );
}

function PlotCell({ plot, planting, index, onClick }: { plot: Plot; planting?: Planting; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  if (plot.is_walkway) return <div className="bg-transparent border-none" />;

  return (
    <div
      className="plot-cell rounded-lg cursor-pointer relative flex flex-col items-center justify-center gap-1 transition-all"
      style={{
        background: planting ? (hovered ? "rgba(74,103,65,0.55)" : "rgba(58,74,46,0.4)") : (hovered ? "rgba(58,74,46,0.35)" : "rgba(46,42,30,0.5)"),
        border: `1px solid ${planting ? (hovered ? "#7a9a6e" : "rgba(122,154,110,0.4)") : (hovered ? "rgba(122,154,110,0.3)" : "rgba(122,154,110,0.15)")}`,
        transform: hovered ? "scale(1.04)" : "scale(1)",
        padding: "6px 2px", minWidth: "70px", minHeight: "90px",
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      {planting ? (
        <>
          <span style={{ fontSize: "1.2rem" }}>{planting.emoji || VEGE_EMOJI[planting.vegetable_name.toLowerCase()] || "🌱"}</span>
          <StarRating rating={planting.status_rating ?? 0} />
          <span className="font-mono text-center px-1 line-clamp-2" style={{ fontSize: "0.6rem", color: "#a3e635" }}>
            {planting.vegetable_name}
          </span>
        </>
      ) : (
        <Sprout size={12} className="opacity-20 text-[#7a9a6e]" />
      )}
    </div>
  );
}

export default function GardenGrid({ plantings, onSave }: Props) {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const plantingMap = new Map(plantings.map(p => [p.plot_id, p]));

  return (
    <div className="w-full">
      <div className="overflow-x-auto pb-6 scrollbar-hide">
        <div 
          className="grid gap-2"
          style={{ gridTemplateColumns: '50px repeat(15, minmax(75px, 1fr))', minWidth: '1150px' }}
        >
          {/* Header Row */}
          <div className="h-10 flex items-center justify-center font-mono text-[10px] text-[#7a9a6e]/40 border-r border-b border-[#7a9a6e]/10">R\C</div>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-10 flex items-center justify-center font-mono text-[10px] text-[#7a9a6e]/60 border-b border-[#7a9a6e]/10">COL {i+1}</div>
          ))}

          {/* Grid Rows */}
          {Array.from({ length: 7 }).map((_, r) => (
            <React.Fragment key={r}>
              <div className="flex items-center justify-center font-mono text-[10px] text-[#7a9a6e]/60 border-r border-[#7a9a6e]/10">ROW {r+1}</div>
              {MOCK_PLOTS.slice(r * 15, (r + 1) * 15).map((plot, i) => (
                <PlotCell key={plot.id} plot={plot} planting={plantingMap.get(plot.id)} index={r*15+i} onClick={() => !plot.is_walkway && setSelectedPlot(plot)} />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      {selectedPlot && <PlantingModal plot={selectedPlot} existingPlanting={plantingMap.get(selectedPlot.id)} onClose={() => setSelectedPlot(null)} onSave={onSave} />}
    </div>
  );
}
