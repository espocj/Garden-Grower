"use client";

import { useState, useMemo } from "react";
import { Planting, MOCK_PLOTS } from "@/lib/mockData";
import { Star, Search, Columns, Check, X as XIcon, ImageIcon } from "lucide-react";

interface Props {
  plantings: Planting[];
  onUpdate: (id: string, updates: Partial<Planting>) => void;
}

const COLUMNS = [
  { id: "year", label: "Season" },
  { id: "photo", label: "Photo" },
  { id: "crop", label: "Crop" },
  { id: "category", label: "Category" },
  { id: "variety", label: "Variety / Strain" },
  { id: "source", label: "Seed Source" },
  { id: "started", label: "Started From" },
  { id: "seedDate", label: "Seed Date" },
  { id: "plantDate", label: "Plant Date" },
  { id: "plots", label: "Plots Occupied" },
  { id: "rating", label: "Rating" },
  { id: "again", label: "Plant Again" },
  { id: "notes", label: "Notes" },
];

export default function HistoricalDatabase({ plantings }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState<string>("All");
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  
  // Default: All columns are visible
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>(
    COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );

  const toggleColumn = (id: string) => {
    setVisibleCols(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Derive unique years for the filter dropdown
  const uniqueYears = useMemo(() => {
    const years = new Set(plantings.map(p => p.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [plantings]);

  // Filter the data
  const filteredPlantings = useMemo(() => {
    return plantings.filter(p => {
      const matchesYear = filterYear === "All" || p.year.toString() === filterYear;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        p.vegetable_name.toLowerCase().includes(searchLower) ||
        (p.strain && p.strain.toLowerCase().includes(searchLower)) ||
        (p.notes && p.notes.toLowerCase().includes(searchLower));
      
      return matchesYear && matchesSearch;
    }).sort((a, b) => b.year - a.year);
  }, [plantings, filterYear, searchTerm]);

  return (
    <div className="flex flex-col gap-4">
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1c1a14]/60 p-4 rounded-xl border border-[#7a9a6e]/20 backdrop-blur-md shadow-lg">
        
        {/* Search & Year Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-2.5 text-[#7a9a6e] w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search crops, varieties, notes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 border border-[#7a9a6e]/30 rounded-lg pl-9 pr-4 py-2 text-sm text-[#f5f2e9] focus:outline-none focus:border-[#a3e635] placeholder:text-[#7a9a6e]/50"
            />
          </div>
          <select 
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="bg-black/40 border border-[#7a9a6e]/30 rounded-lg px-3 py-2 text-sm text-[#f5f2e9] focus:outline-none focus:border-[#a3e635] outline-none cursor-pointer"
          >
            <option value="All">All Seasons</option>
            {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Column Toggler */}
        <div className="relative w-full sm:w-auto flex justify-end">
          <button 
            onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
            className="flex items-center gap-2 bg-[#4a6741]/20 border border-[#7a9a6e]/40 hover:bg-[#4a6741]/40 text-[#d4c49a] px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Columns size={16} />
            <span className="font-mono uppercase tracking-widest text-[10px]">Columns</span>
          </button>

          {isColumnMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-[#2e2a1e] border border-[#7a9a6e]/40 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3 border-b border-[#7a9a6e]/20 flex justify-between items-center bg-[#1c1a14]">
                <span className="text-xs font-mono text-[#7a9a6e] uppercase tracking-widest">Show/Hide</span>
                <button onClick={() => setIsColumnMenuOpen(false)} className="text-[#7a9a6e] hover:text-[#f5f2e9]"><XIcon size={14}/></button>
              </div>
              <div className="max-h-64 overflow-y-auto p-2 scrollbar-hide">
                {COLUMNS.map(col => (
                  <label key={col.id} className="flex items-center gap-3 p-2 hover:bg-black/20 rounded cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      checked={visibleCols[col.id]} 
                      onChange={() => toggleColumn(col.id)}
                      className="w-4 h-4 accent-[#a3e635] cursor-pointer"
                    />
                    <span className="text-sm text-[#f5f2e9]">{col.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="w-full overflow-x-auto rounded-xl border border-[#7a9a6e]/20 bg-[#1c1a14]/60 backdrop-blur-md shadow-2xl scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="border-b border-[#7a9a6e]/30 text-[10px] font-mono text-[#7a9a6e] uppercase tracking-widest bg-black/40 whitespace-nowrap">
              {visibleCols.year && <th className="py-4 px-5">Season</th>}
              {visibleCols.photo && <th className="py-4 px-5 text-center">Photo</th>}
              {visibleCols.crop && <th className="py-4 px-5">Crop</th>}
              {visibleCols.category && <th className="py-4 px-5">Category</th>}
              {visibleCols.variety && <th className="py-4 px-5">Variety / Strain</th>}
              {visibleCols.source && <th className="py-4 px-5">Seed Source</th>}
              {visibleCols.started && <th className="py-4 px-5">Started From</th>}
              {visibleCols.seedDate && <th className="py-4 px-5">Seed Date</th>}
              {visibleCols.plantDate && <th className="py-4 px-5">Plant Date</th>}
              {visibleCols.plots && <th className="py-4 px-5">Plots Occupied</th>}
              {visibleCols.rating && <th className="py-4 px-5">Rating</th>}
              {visibleCols.again && <th className="py-4 px-5 text-center">Plant Again</th>}
              {visibleCols.notes && <th className="py-4 px-5">Notes</th>}
            </tr>
          </thead>
          <tbody className="text-sm text-[#f5f2e9]">
            {filteredPlantings.length > 0 ? filteredPlantings.map((p) => (
              <tr key={p.id} className="border-b border-[#7a9a6e]/10 hover:bg-[#7a9a6e]/5 transition-colors whitespace-nowrap">
                {/* Season */}
                {visibleCols.year && <td className="py-3 px-5 font-mono text-xs text-[#d4c49a]">{p.year}</td>}
                
                {/* Photo */}
                {visibleCols.photo && (
                  <td className="py-3 px-5">
                    {p.image_url ? (
                      <div className="w-8 h-8 rounded border border-[#7a9a6e]/30 overflow-hidden mx-auto cursor-pointer hover:border-[#a3e635] transition-colors" onClick={() => window.open(p.image_url)}>
                        <img src={p.image_url} alt="Crop" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center text-[#7a9a6e]/30 mx-auto">
                        <ImageIcon size={16} />
                      </div>
                    )}
                  </td>
                )}

                {/* Crop */}
                {visibleCols.crop && (
                  <td className="py-3 px-5 flex items-center gap-2">
                    <span className="text-lg">{p.emoji || "🌱"}</span>
                    <span className="font-bold tracking-wide">{p.vegetable_name}</span>
                  </td>
                )}

                {/* Category */}
                {visibleCols.category && <td className="py-3 px-5 text-[#d4c49a]">{p.category || "—"}</td>}

                {/* Variety */}
                {visibleCols.variety && <td className="py-3 px-5 text-[#d4c49a]/80 italic">{p.strain || "—"}</td>}

                {/* Source */}
                {visibleCols.source && <td className="py-3 px-5 text-[#d4c49a]">{p.seed_source || "—"}</td>}

                {/* Started From */}
                {visibleCols.started && (
                  <td className="py-3 px-5 text-xs font-mono text-[#7a9a6e] uppercase tracking-widest">
                    {p.started_from}
                  </td>
                )}

                {/* Seed Date */}
                {visibleCols.seedDate && (
                  <td className="py-3 px-5 text-xs font-mono text-[#d4c49a]">
                    {p.seed_plant_date ? new Date(p.seed_plant_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
                  </td>
                )}

                {/* Plant Date */}
                {visibleCols.plantDate && (
                  <td className="py-3 px-5 text-xs font-mono text-[#a3e635]">
                    {new Date(p.garden_plant_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                )}

                {/* Plots Occupied */}
                {visibleCols.plots && (
                  <td className="py-3 px-5">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {p.plot_ids?.map((id) => {
                        const plot = MOCK_PLOTS.find(pl => pl.id === id);
                        return (
                          <span key={id} className="px-1.5 py-0.5 rounded border border-[#7a9a6e]/30 font-mono text-[9px] text-[#a3e635] bg-black/20">
                            {plot ? `R${plot.grid_row}C${plot.grid_col}` : id}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                )}

                {/* Rating */}
                {visibleCols.rating && (
                  <td className="py-3 px-5">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={12} fill={n <= p.status_rating ? "#FBBF24" : "transparent"} color={n <= p.status_rating ? "#FBBF24" : "rgba(122,154,110,0.3)"} />
                      ))}
                    </div>
                  </td>
                )}

                {/* Will Plant Again */}
                {visibleCols.again && (
                  <td className="py-3 px-5 text-center">
                    {p.will_plant_again ? (
                      <Check size={16} className="text-[#a3e635] mx-auto" />
                    ) : (
                      <XIcon size={16} className="text-red-400/80 mx-auto" />
                    )}
                  </td>
                )}

                {/* Notes */}
                {visibleCols.notes && (
                  <td className="py-3 px-5">
                    <div className="max-w-[250px] truncate text-xs text-[#d4c49a]/70" title={p.notes}>
                      {p.notes || "—"}
                    </div>
                  </td>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan={13} className="py-12 text-center text-[#7a9a6e]">
                  No planting records found for these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
