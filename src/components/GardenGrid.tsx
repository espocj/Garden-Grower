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
    <div className="flex gap-0.5 mt-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          style={{
            width: "6px", height: "6px",
            fill: n <= rating ? "var(--gold)" : "transparent",
            color: n <= rating ? "var(--gold)" : "rgba(122,154,110,0.1)",
          }}
        />
      ))}
    </div>
  );
}

function PlotCell({ plot, planting, index, onClick }: { plot: Plot; planting?: Planting; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  if (plot.is_walkway) {
    return <div className="rounded-sm opacity-0" />;
  }

  const hasPlanting = !!planting;
  const delay = `${(index % 15) * 10}ms`;

  return (
    <div
      className="rounded-md cursor-pointer relative flex flex-col items-center justify-start transition-all overflow-hidden"
      style={{
        animation: "fadeIn 0.5s ease-out forwards",
        animationDelay: delay,
        background: hasPlanting
          ? hovered ? "rgba(74,103,65,0.6)" : "rgba(58,74,46,0.45)"
          : hovered ? "rgba(58,74,46,0.3)" : "rgba(46,42,30,0.5)",
        border: hasPlanting
          ? `1px solid ${hovered ? "var(--sage)" : "rgba(122,154,110,0.3)"}`
          : `1px solid ${hovered ? "rgba(122,154,110,0.3)" : "rgba(122,154,110,0.1)"}`,
        transform: hovered ? "scale(1.05)" : "scale(1)",
        aspectRatio: "1 / 1.4", 
        padding: "4px 1px",
        zIndex: hovered ? 10 : 1
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hasPlanting ? (
        <>
          <span className="text-base md:text-xl leading-none">
            {getEmoji(planting.vegetable_name, planting.emoji)}
          </span>
          <StarRating rating={planting.status_rating ?? 0} />
          <span
            className="font-mono text-center w-full px-0.5 line-clamp-2 break-words"
            style={{
              fontSize: "0.45rem",
              color: "var(--mint)",
              lineHeight: "0.55rem",
              marginTop: "auto",
              paddingBottom: "2px"
            }}
          >
            {planting.vegetable_name}
          </span>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <Sprout size={10} className="opacity-10 text-sage" />
        </div>
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
      {/* Legend */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-moss/40 border border-sage/40" />
            <span className="text-[0.6rem] font-mono text-straw uppercase tracking-wider">Planted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-bark/40 border border-sage/10" />
            <span className="text-[0.6rem] font-mono text-straw uppercase tracking-wider">Empty</span>
          </div>
        </div>
        <span className="text-[0.6rem] font-mono text-sage/60 uppercase tracking-widest hidden sm:block">
          ← Back Row (Bedford)
        </span>
      </div>

      {/* The 15-Column Custom Grid (Inline Style for Reliability) */}
      <div 
        className="grid w-full gap-1"
        style={{ 
          gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' 
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

      <div className="flex justify-between items-center mt-3 text-[0.55rem] font-mono text-sage/40 uppercase tracking-tighter">
        <span>Front Path →</span>
        <div className="flex gap-3">
           {[1,2,3,4,5,6,7].map(r => <span key={r}>R{r}</span>)}
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
