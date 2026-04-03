"use client";

import { Planting, MOCK_PLOTS } from "@/lib/mockData";
import { Star } from "lucide-react";

interface Props {
  plantings: Planting[];
  onUpdate: (id: string, updates: Partial<Planting>) => void;
}

export default function HistoricalDatabase({ plantings }: Props) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#7a9a6e]/20 bg-[#1c1a14]/60 backdrop-blur-md shadow-2xl">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-[#7a9a6e]/30 text-[10px] font-mono text-[#7a9a6e] uppercase tracking-widest bg-black/40">
            <th className="py-4 px-6">Season</th>
            <th className="py-4 px-6">Crop</th>
            <th className="py-4 px-6">Variety</th>
            <th className="py-4 px-6">Plots Occupied</th>
            <th className="py-4 px-6">Rating</th>
            <th className="py-4 px-6 text-right">Planted Date</th>
          </tr>
        </thead>
        <tbody className="text-sm text-[#f5f2e9]">
          {plantings.sort((a, b) => b.year - a.year).map((p) => (
            <tr key={p.id} className="border-b border-[#7a9a6e]/10 hover:bg-[#7a9a6e]/5 transition-colors">
              <td className="py-4 px-6 font-mono text-xs text-[#d4c49a]">{p.year}</td>
              <td className="py-4 px-6 flex items-center gap-3">
                <span className="text-xl">{p.emoji || "🌱"}</span>
                <span className="font-bold tracking-wide">{p.vegetable_name}</span>
              </td>
              <td className="py-4 px-6 text-[#d4c49a]/80 italic">{p.strain || "—"}</td>
              <td className="py-4 px-6">
                <div className="flex flex-wrap gap-1">
                  {p.plot_ids?.map((id) => {
                    const plot = MOCK_PLOTS.find(pl => pl.id === id);
                    return (
                      <span key={id} className="px-2 py-1 rounded-md bg-[#4a6741]/30 border border-[#7a9a6e]/30 font-mono text-[10px] text-[#a3e635]">
                        {plot ? `R${plot.grid_row}C${plot.grid_col}` : id}
                      </span>
                    );
                  })}
                </div>
              </td>
              <td className="py-4 px-6">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={12} fill={n <= p.status_rating ? "#FBBF24" : "transparent"} color={n <= p.status_rating ? "#FBBF24" : "rgba(122,154,110,0.3)"} />
                  ))}
                </div>
              </td>
              <td className="py-4 px-6 text-right font-mono text-[10px] text-[#7a9a6e] uppercase tracking-widest">
                {new Date(p.garden_plant_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
