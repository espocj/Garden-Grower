"use client";

import React, { useState } from "react";
import { Sprout, Star } from "lucide-react";
import { MOCK_PLOTS, Plot, Planting } from "@/lib/mockData";
import PlantingModal from "./PlantingModal";

interface Props {
  plantings: Planting[];
  onSave: (data: Partial<Planting>, duplicatePlotIds: string[]) => void;
}

// RESTORED: Emoji Dictionary for common plants
const VEGE_EMOJI: Record<string, string> = {
  tomato: "🍅", basil: "🌿", pepper: "🫑", "bell pepper": "🫑",
  zucchini: "🥒", cucumber: "🥒", kale: "🥬", eggplant: "🍆",
  lettuce: "🥗", "pole beans": "🫘", carrot: "🥕",
  "swiss chard": "🌿", pumpkin: "🎃", marigold: "🌼",
  jalapeño: "🌶️", strawberry: "🍓", garlic: "🧄", onion: "🧅"
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
        <Star key={n} size={8} fill={n <= rating ? "#FBBF24" : "transparent"} color={n <= rating ? "#FBBF24" : "rgba(255,255,255,0.1)"} />
      ))}
    </div>
  );
}

function PlotCell({ plot, planting, index, onClick }: { plot: Plot; planting?: Planting; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  if (plot.is_walkway) return <div className="bg-transparent opacity-0" />;

  return (
    <div
      className="rounded-md flex flex-col items-center justify-center transition-all cursor-pointer border-2 relative"
      style={{
        background: planting ? (hovered ? "#6d4c41" : "#5d4037") : (hovered ? "#4d3a2e" : "#3e2723"),
        borderColor: planting ? "#94a77e" : "transparent",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 4px 15px rgba(0,0,0,0.25)" : "none",
        aspectRatio: "1 / 1.4",
        padding: "4px 1px",
        zIndex: hovered ? 10 : 1
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)} 
      onMouseLeave={() => setHovered(false)}
    >
      {planting ? (
        <>
          <span className="text-xl leading-none mb-1">{getEmoji(planting.vegetable_name, planting.emoji)}</span>
          <StarRating rating={planting.status_rating ?? 0} />
          <span className="font-mono text-center font-bold uppercase w-full px-1 mt-1 leading-[0.6rem] line-clamp-2" style={{ fontSize: "0.55rem", color: "#94a77e" }}>
            {planting.vegetable_name}
          </span>
        </>
      ) : (
        <Sprout size={10} className="text-[#c4b396] opacity-15" />
      )}
    </div>
  );
}

export default function GardenGrid({ plantings, onSave }: Props) {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const plantingMap = new Map(plantings.map(p => [p.plot_id, p]));

  return (
    <div className="w-full px-2 lg:px-12">
      <div className="grid w-full gap-1.5" style={{ gridTemplateColumns: '40px repeat(15, minmax(0, 1fr))' }}>
        <div className="h-8 flex items-center justify-center font-mono text-[9px] text-[#3e2723]/40 border-b border-[#3e2723]/10">R\C</div>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="h-8 flex items-center justify-center font-mono text-[9px] text-[#3e2723]/60 font-bold uppercase border-b border-[#3e2723]/10">{i+1}</div>
        ))}
        {Array.from({ length: 7 }).map((_, r) => (
          <React.Fragment key={r}>
            <div className="flex items-center justify-center font-mono text-[9px] text-[#3e2723]/60 font-bold uppercase">R{r+1}</div>
            {MOCK_PLOTS.slice(r * 15, (r + 1) * 15).map((plot, i) => (
              <PlotCell key={plot.id} plot={plot} planting={plantingMap.get(plot.id)} index={r*15+i} onClick={() => !plot.is_walkway && setSelectedPlot(plot)} />
            ))}
          </React.Fragment>
        ))}
      </div>
      {selectedPlot && <PlantingModal plot={selectedPlot} existingPlanting={plantingMap.get(selectedPlot.id)} onClose={() => setSelectedPlot(null)} onSave={onSave} />}
    </div>
  );
}
