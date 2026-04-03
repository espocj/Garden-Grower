"use client";

import React, { useState } from "react";
import { Sprout, Star } from "lucide-react";
import { MOCK_PLOTS, Plot, Planting } from "@/lib/mockData";
import PlantingModal from "./PlantingModal";

interface Props {
  plantings: Planting[];
  onSave: (data: Partial<Planting>, duplicatePlotIds: string[]) => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star 
          key={n} 
          size={8} 
          fill={n <= rating ? "#FBBF24" : "transparent"} 
          stroke={n <= rating ? "#FBBF24" : "#d4c49a"} 
          strokeWidth={n <= rating ? 0 : 1}
        />
      ))}
    </div>
  );
}

function PlotCell({ plot, planting, index, onClick }: { plot: Plot; planting?: Planting; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  if (plot.is_walkway) return <div className="bg-transparent opacity-0" />;

  return (
    <div
      className="rounded flex flex-col items-center justify-center transition-all cursor-pointer border"
      style={{
        // BRIGHTER TAN/BROWN COLORS
        background: planting ? (hovered ? "#e8decb" : "#f4ece2") : (hovered ? "#fdfbf7" : "#faf9f6"),
        borderColor: planting ? (hovered ? "#8c7851" : "#d4c49a") : (hovered ? "#d4c49a" : "#e8decb"),
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 4px 12px rgba(69,50,46,0.1)" : "none",
        aspectRatio: "1 / 1.3",
        padding: "2px"
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)} 
      onMouseLeave={() => setHovered(false)}
    >
      {planting ? (
        <>
          <span className="text-lg leading-none">{planting.emoji || "🌱"}</span>
          <StarRating rating={planting.status_rating ?? 0} />
          <span className="font-mono text-center text-[#45322e] w-full px-0.5 mt-1 leading-[0.6rem] line-clamp-2" style={{ fontSize: "0.55rem" }}>
            {planting.vegetable_name}
          </span>
        </>
      ) : (
        <Sprout size={10} className="text-[#d4c49a] opacity-40" />
      )}
    </div>
  );
}

export default function GardenGrid({ plantings, onSave }: Props) {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const plantingMap = new Map(plantings.map(p => [p.plot_id, p]));

  return (
    <div className="w-full max-w-full px-2 sm:px-6 lg:px-10">
      {/* 15-Column Responsive Grid (NO SCROLL) */}
      <div 
        className="grid w-full gap-1 sm:gap-1.5"
        style={{ 
          gridTemplateColumns: '35px repeat(15, minmax(0, 1fr))',
        }}
      >
        {/* Row 0: Column Labels */}
        <div className="h-6 flex items-center justify-center text-[9px] font-mono text-[#a69177]">R\C</div>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="h-6 flex items-center justify-center text-[9px] font-mono text-[#a69177] uppercase">{i+1}</div>
        ))}

        {/* Rows 1-7 */}
        {Array.from({ length: 7 }).map((_, r) => (
          <React.Fragment key={r}>
            <div className="flex items-center justify-center text-[9px] font-mono text-[#a69177] uppercase">{r+1}</div>
            {MOCK_PLOTS.slice(r * 15, (r + 1) * 15).map((plot, i) => (
              <PlotCell 
                key={plot.id} 
                plot={plot} 
                planting={plantingMap.get(plot.id)} 
                index={r*15+i} 
                onClick={() => !plot.is_walkway && setSelectedPlot(plot)} 
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      {selectedPlot && (
        <PlantingModal 
          plot={selectedPlot} 
          existingPlanting={plantingMap.get(selectedPlot.id)} 
          onClose={() => setSelectedPlot(null)} 
          onSave={onSave} 
        />
      )}
    </div>
  );
}
