"use client";

import { useState, useMemo } from "react";
import { Planting, MOCK_PLOTS } from "@/lib/mockData";
import { Star, Columns, Check, X as XIcon, ImageIcon, Plus } from "lucide-react";
import PlantingModal from "./PlantingModal";

interface Props {
  plantings: Planting[];
  onSave: (data: Partial<Planting>) => void;
  onDelete?: (id: string) => void;
}

const COLUMNS = [
  { id: "year", label: "Season" },
  { id: "photo", label: "Photo" },
  { id: "crop", label: "Crop" },
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

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function HistoricalDatabase({ plantings, onSave, onDelete }: Props) {
  const [filterYear, setFilterYear] = useState<string>("All");
  const [filterCrop, setFilterCrop] = useState<string>("All");
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  
  // Track either an existing planting to edit, or true to create a new historical record
  const [editingPlanting, setEditingPlanting] = useState<Planting | null>(null);
  const [isAddingHistorical, setIsAddingHistorical] = useState(false);
  
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>(
    COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );

  const toggleColumn = (id: string) => {
    setVisibleCols(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const showAllColumns = () => {
    setVisibleCols(COLUMNS.reduce((acc, col) => ({ ...acc, [col.id]: true }), {}));
  };

  const uniqueYears = useMemo(() => {
    const years = new Set(plantings.map(p => p.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [plantings]);

  const uniqueCrops = useMemo(() => {
    const crops = new Set(plantings.map(p => p.vegetable_name));
    return Array.from(crops).sort();
  }, [plantings]);

  const filteredPlantings = useMemo(() => {
    return plantings.filter(p => {
      const matchesYear = filterYear === "All" || p.year.toString() === filterYear;
      const matchesCrop = filterCrop === "All" || p.vegetable_name === filterCrop;
      return matchesYear && matchesCrop;
    }).sort((a, b) => b.year - a.year);
  }, [plantings, filterYear, filterCrop]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative z-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1c1a14]/80 p-4 rounded-xl border border-[#7a9a6e]/20 backdrop-blur-md shadow-lg">
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select 
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="bg-black/40 border border-[#7a9a6e]/30 rounded-lg px-3 py-2 text-sm text-[#f5f2e9] focus:outline-none focus:border-[#a3e635] outline-none cursor-pointer"
          >
            <option value="All">All Seasons</option>
            {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select 
            value={filterCrop}
            onChange={(e) => setFilterCrop(e.target.value)}
            className="bg-black/40 border border-[#7a9a6e]/30 rounded-lg px-3 py-2 text-sm text-[#f5f2e9] focus:outline-none focus:border-[#a3e635] outline-none cursor-pointer"
          >
            <option value="All">All Crops</option>
            {uniqueCrops.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="relative w-full sm:w-auto flex justify-end gap-2">
          
          {/* NEW: Add Historical Record Button */}
          <button 
            onClick={() => setIsAddingHistorical(true)}
            className="flex items-center gap-2 bg-[#7a9a6e] hover:bg-[#a3e635] text-[#1c1a14] px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md"
          >
            <Plus size={16} />
            <span className="font-mono uppercase tracking-widest text-[10px]">Add Record</span>
          </button>

          <button 
            onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
            className="flex items-center gap-2 bg-[#4a6741]/20 border border-[#7a9a6e]/40 hover:bg-[#4a6741]/40 text-[#d4c49a] px-4 py-2 rounded-lg text-sm transition-colors shadow-md"
          >
            <Columns size={16} />
            <span className="font-mono uppercase tracking-widest text-[10px]">Columns</span>
          </button>

          {isColumnMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-[#2e2a1e] border border-[#7a9a6e]/40 rounded-xl shadow-2xl z-[100] overflow-hidden">
              <div className="p-3 border-b border-[#7a9a6e]/20 flex justify-between items-center bg-[#1c1a14]">
                <button 
                  onClick={showAllColumns} 
                  className="text-[10px] font-mono font-bold text-[#a3e635] hover:text-[#f5f2e9] uppercase tracking-widest transition-colors"
                >
                  Show All
                </button>
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

      <div className="relative z-10 w-full overflow-x-auto rounded-xl border border-[#7a9a6e]/20 bg-[#1c1a14]/60 backdrop-blur-md shadow-2xl scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="border-b border-[#7a9a6e]/30 text-[10px] font-mono text-[#7a9a6e] uppercase tracking-widest bg-black/40 whitespace-nowrap">
              {visibleCols.year && <th className="py-4 px-5 align-middle">Season</th>}
              {visibleCols.photo && <th className="py-4 px-5 align-middle text-center">Photo</th>}
              {visibleCols.crop && <th className="py-4 px-5 align-middle text-center">Crop</th>}
              {visibleCols.variety && <th className="py-4 px-5 align-middle">Variety / Strain</th>}
              {visibleCols.source && <th className="py-4 px-5 align-middle">Seed Source</th>}
              {visibleCols.started && <th className="py-4 px-5 align-middle">Started From</th>}
              {visibleCols.seedDate && <th className="py-4 px-5 align-middle">Seed Date</th>}
              {visibleCols.plantDate && <th className="py-4 px-5 align-middle">Plant Date</th>}
              {visibleCols.plots && <th className="py-4 px-5 align-middle">Plots Occupied</th>}
              {visibleCols.rating && <th className="py-4 px-5 align-middle">Rating</th>}
              {visibleCols.again && <th className="py-4 px-5 align-middle text-center">Plant Again</th>}
              {visibleCols.notes && <th className="py-4 px-5 align-middle">Notes</th>}
            </tr>
          </thead>
          <tbody className="text-sm text-[#f5f2e9]">
            {filteredPlantings.length > 0 ? filteredPlantings.map((p) => (
              <tr 
                key={p.id} 
                onClick={() => setEditingPlanting(p)}
                className="cursor-pointer border-b border-[#7a9a6e]/10 hover:bg-[#7a9a6e]/15 transition-colors whitespace-nowrap"
              >
                {visibleCols.year && <td className="py-3 px-5 align-middle font-mono text-xs text-[#d4c49a]">{p.year}</td>}
                
                {visibleCols.photo && (
                  <td className="py-3 px-5 align-middle" onClick={(e) => e.stopPropagation()}>
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

                {visibleCols.crop && (
                  <td className="py-3 px-5 align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">{p.emoji || "🌱"}</span>
                      <span className="font-bold tracking-wide text-[#a3e635]">{p.vegetable_name}</span>
                    </div>
                  </td>
                )}

                {visibleCols.variety && <td className="py-3 px-5 align-middle text-[#d4c49a]/80 italic">{p.strain || "—"}</td>}
                {visibleCols.source && <td className="py-3 px-5 align-middle text-[#d4c49a]">{p.seed_source || "—"}</td>}
                {visibleCols.started && <td className="py-3 px-5 align-middle text-xs font-mono text-[#7a9a6e] uppercase tracking-widest">{p.started_from}</td>}
                
                {visibleCols.seedDate && (
                  <td className="py-3 px-5 align-middle text-xs font-mono text-[#d4c49a]">
                    {formatDate(p.seed_plant_date)}
                  </td>
                )}

                {visibleCols.plantDate && (
                  <td className="py-3 px-5 align-middle text-xs font-mono text-[#a3e635]">
                    {formatDate(p.garden_plant_date)}
                  </td>
                )}

                {visibleCols.plots && (
                  <td className="py-3 px-5 align-middle">
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

                {visibleCols.rating && (
                  <td className="py-3 px-5 align-middle">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={12} fill={n <= p.status_rating ? "#FBBF24" : "transparent"} color={n <= p.status_rating ? "#FBBF24" : "rgba(122,154,110,0.3)"} />
                      ))}
                    </div>
                  </td>
                )}

                {visibleCols.again && (
                  <td className="py-3 px-5 align-middle text-center">
                    {p.will_plant_again ? <Check size={16} className="text-[#a3e635] mx-auto" /> : <XIcon size={16} className="text-red-400/80 mx-auto" />}
                  </td>
                )}

                {visibleCols.notes && (
                  <td className="py-3 px-5 align-middle">
                    <div className="max-w-[400px] whitespace-normal text-xs text-[#d4c49a]/70 leading-relaxed" title={p.notes}>
                      {p.notes || "—"}
                    </div>
                  </td>
                )}
              </tr>
            )) : (
              <tr>
                <td colSpan={12} className="py-12 text-center text-[#7a9a6e] align-middle">
                  No planting records found for these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Editing an existing planting */}
      {editingPlanting && (
        <PlantingModal 
          plot={editingPlanting.plot_ids?.length ? MOCK_PLOTS.find(pl => pl.id === editingPlanting.plot_ids![0]) : null}
          existingPlanting={editingPlanting}
          onClose={() => setEditingPlanting(null)}
          onSave={(data) => {
            onSave(data);
            setEditingPlanting(null);
          }}
          onDelete={onDelete}
        />
      )}

      {/* Adding a new "Plot-less" Historical Record */}
      {isAddingHistorical && (
        <PlantingModal 
          plot={null}
          onClose={() => setIsAddingHistorical(false)}
          onSave={(data) => {
            onSave(data);
            setIsAddingHistorical(false);
          }}
        />
      )}
    </div>
  );
}
