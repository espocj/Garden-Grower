"use client";

import { useState, useEffect } from "react";
import { X, Star, Upload, Copy, ChevronDown, Maximize2, Trash2 } from "lucide-react";
import { MOCK_PLOTS, MOCK_PLANTINGS, Planting, Plot } from "@/lib/mockData";

interface Props {
  plot?: Plot | null;
  existingPlanting?: Planting;
  onClose: () => void;
  onSave: (data: Partial<Planting>) => void;
  onDelete?: (id: string) => void;
}

const VEGE_EMOJI: Record<string, string> = {
  tomato: "🍅", basil: "🌿", pepper: "🫑", "bell pepper": "🫑",
  zucchini: "🥒", cucumber: "🥒", kale: "🥬", eggplant: "🍆",
  lettuce: "🥗", "pole beans": "🫘", carrot: "🥕",
  "swiss chard": "🌿", pumpkin: "🎃", marigold: "🌼",
  jalapeño: "🌶️", strawberry: "🍓", garlic: "🧄", onion: "🧅"
};

export default function PlantingModal({ plot, existingPlanting, onClose, onSave, onDelete }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const currentYear = existingPlanting?.year || new Date().getFullYear();
  
  const EMPTY_FORM: Partial<Planting> = {
    plot_ids: plot ? [plot.id] : [],
    vegetable_name: "",
    emoji: "",
    strain: "",
    seed_source: "",
    started_from: "seed",
    seed_plant_date: today,
    garden_plant_date: today,
    status_rating: 3,
    notes: "",
    will_plant_again: true,
    year: currentYear,
  };

  const [form, setForm] = useState<Partial<Planting>>(existingPlanting ?? EMPTY_FORM);
  const [rating, setRating] = useState(existingPlanting?.status_rating ?? 3);
  const [hoverRating, setHoverRating] = useState(0);
  const [dupeOpen, setDupeOpen] = useState(false);

  // Auto-emoji logic (works for both Grid and History Add)
  useEffect(() => {
    if (form.vegetable_name && !form.emoji) {
      const name = form.vegetable_name.toLowerCase();
      for (const [key, val] of Object.entries(VEGE_EMOJI)) {
        if (name.includes(key)) {
          set("emoji", val);
          break;
        }
      }
    }
  }, [form.vegetable_name]);

  const occupiedThisYear = new Set(
    MOCK_PLANTINGS.filter(p => p.year === form.year && p.id !== existingPlanting?.id).flatMap(p => p.plot_ids || [])
  );
  const emptyPlots = MOCK_PLOTS.filter(p => !p.is_walkway && !occupiedThisYear.has(p.id) && p.id !== plot?.id);

  function set(key: keyof Planting, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleDupe(plotId: string) {
    const currentIds = form.plot_ids || (plot ? [plot.id] : []);
    const newIds = currentIds.includes(plotId) 
      ? currentIds.filter(id => id !== plotId) 
      : [...currentIds, plotId];
    set("plot_ids", newIds);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.year) return; // Prevent saving if blank
    const finalPlotIds = form.plot_ids && form.plot_ids.length > 0 ? form.plot_ids : (plot ? [plot.id] : []);
    onSave({ ...form, status_rating: rating, plot_ids: finalPlotIds });
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const plotLabel = plot ? `Row ${plot.grid_row}, Col ${plot.grid_col}` : "Historical Record";
  const currentPlotIds = form.plot_ids || (plot ? [plot.id] : []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,8,4,0.75)", backdropFilter: "blur(6px)" }}>
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden" style={{ background: "linear-gradient(160deg, #1c1a14 0%, #2e2a1e 100%)", border: "1px solid rgba(122,154,110,0.3)", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
        
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 z-20 bg-[#1c1a14] border-b border-[#7a9a6e]/20">
          <div>
            <h2 className="font-display text-xl text-[#f5f2e9]">{existingPlanting ? existingPlanting.vegetable_name : "New Planting"}</h2>
            <p className="font-mono text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase">{plotLabel} · Season {form.year || "—"}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-[#d4c49a] hover:bg-[#7a9a6e]/20 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full">
          <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-5 w-full">

            {/* Photo Uploader */}
            <div className="w-full h-48 rounded-xl overflow-hidden relative border border-[#7a9a6e]/30 bg-black/40 flex items-center justify-center group">
              {form.image_url ? (
                <>
                  <img src={form.image_url} alt="Crop" className="w-full h-full object-contain p-2" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button type="button" onClick={() => window.open(form.image_url)} className="p-2 bg-black/60 hover:bg-black/80 rounded-lg text-[#f5f2e9] backdrop-blur-md transition-colors shadow-lg">
                      <Maximize2 size={16} />
                    </button>
                    <label className="p-2 bg-[#7a9a6e] hover:bg-[#a3e635] hover:text-black rounded-lg text-[#f5f2e9] backdrop-blur-md cursor-pointer transition-colors shadow-lg">
                      <Upload size={16} />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) set("image_url", URL.createObjectURL(file));
                      }} />
                    </label>
                  </div>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-[#7a9a6e]/10 transition-colors">
                  <Upload className="w-8 h-8 text-[#7a9a6e] mb-2" />
                  <span className="text-xs font-mono text-[#d4c49a] tracking-widest uppercase">Upload Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) set("image_url", URL.createObjectURL(file));
                  }} />
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              <div className="sm:col-span-2 min-w-0">
                <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Vegetable *</label>
                <input className="w-full min-w-0 p-2.5 rounded-lg bg-black/30 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635]" required value={form.vegetable_name ?? ""} onChange={(e) => set("vegetable_name", e.target.value)} />
              </div>
              <div className="sm:col-span-1 min-w-0">
                <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Emoji</label>
                <input className="w-full min-w-0 p-2.5 rounded-lg bg-black/30 border border-[#7a9a6e]/30 text-xl text-center focus:outline-none focus:border-[#a3e635]" value={form.emoji ?? ""} onChange={(e) => set("emoji", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              <div className="sm:col-span-1 min-w-0">
                <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Season Year *</label>
                <input 
                  type="number" 
                  required 
                  placeholder="YYYY"
                  className="w-full min-w-0 p-2.5 rounded-lg bg-black/30 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                  value={form.year === undefined || form.year === null ? "" : form.year} 
                  onChange={(e) => {
                    const val = e.target.value;
                    set("year", val === "" ? undefined : Number(val));
                  }} 
                />
              </div>
              <div className="sm:col-span-1 min-w-0">
                <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Strain / Variety</label>
                <input className="w-full min-w-0 p-2.5 rounded-lg bg-black/30 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635]" placeholder="e.g. Brandywine" value={form.strain ?? ""} onChange={(e) => set("strain", e.target.value)} />
              </div>
              <div className="sm:col-span-1 min-w-0">
                <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Seed Source</label>
                <input className="w-full min-w-0 p-2.5 rounded-lg bg-black/30 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635]" placeholder="e.g. Baker Creek" value={form.seed_source ?? ""} onChange={(e) => set("seed_source", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-[#7a9a6e]/20 bg-[#1c1a14]/50 w-full">
              <div className="min-w-0">
                <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono truncate">Started From</label>
                <select className="w-full min-w-0 px-2 py-2.5 text-sm rounded-lg bg-black/40 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635] outline-none appearance-none" value={form.started_from ?? "seed"} onChange={(e) => set("started_from", e.target.value as "seed" | "plant")}>
                  <option value="seed">Seed</option>
                  <option value="plant">Plant / Transplant</option>
                </select>
              </div>
              
              {form.started_from === "seed" && (
                <div className="min-w-0">
                  <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono truncate">Seed Start Date</label>
                  <input 
                    type="date"
                    style={{ colorScheme: "dark" }} 
                    className="w-full min-w-0 px-2 py-2.5 text-xs rounded-lg bg-black/40 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635] text-left" 
                    value={form.seed_plant_date || today} 
                    onChange={(e) => set("seed_plant_date", e.target.value)} 
                  />
                </div>
              )}

              <div className="min-w-0">
                <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono truncate">Garden Plant Date *</label>
                <input 
                  type="date" 
                  required 
                  style={{ colorScheme: "dark" }} 
                  className="w-full min-w-0 px-2 py-2.5 text-xs rounded-lg bg-black/40 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635] text-left" 
                  value={form.garden_plant_date || today} 
                  onChange={(e) => set("garden_plant_date", e.target.value)} 
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Status Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" className="outline-none flex-shrink-0" onMouseEnter={() => setHoverRating(n)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(n)}>
                    <Star className="w-7 h-7" style={{ fill: n <= (hoverRating || rating) ? "#FBBF24" : "transparent", color: n <= (hoverRating || rating) ? "#FBBF24" : "rgba(122,154,110,0.4)", transition: "all 0.15s" }} />
                  </button>
                ))}
                <span className="ml-3 font-mono text-[0.75rem] text-[#d4c49a] uppercase tracking-widest">
                  {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
                </span>
              </div>
            </div>

            <div className="min-w-0 w-full">
              <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Notes</label>
              <textarea
                className="w-full min-w-0 p-3 rounded-lg bg-black/30 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635] resize-none"
                rows={3}
                placeholder="Observations, companion plants, problems, tips…"
                value={form.notes ?? ""}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>

            {emptyPlots.length > 0 && (
              <div className="rounded-xl p-4 bg-[#4a6741]/10 border border-[#7a9a6e]/20 w-full">
                <button type="button" className="flex items-center gap-2 w-full text-left min-w-0" onClick={() => setDupeOpen(!dupeOpen)}>
                  <Copy className="w-4 h-4 flex-shrink-0 text-[#7a9a6e]" />
                  <span className="text-[0.8rem] text-[#a3e635] uppercase font-mono tracking-widest truncate">Plot Multi-Select</span>
                  <span className="flex-shrink-0 rounded-full px-2 py-0.5 font-mono ml-2 text-[0.6rem] bg-[#7a9a6e] text-black font-bold">
                    {currentPlotIds.length} Linked
                  </span>
                  <ChevronDown className="w-4 h-4 ml-auto flex-shrink-0 transition-transform text-[#7a9a6e]" style={{ transform: dupeOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>

                {dupeOpen && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
                    {emptyPlots.map((ep) => {
                      const isSelected = currentPlotIds.includes(ep.id);
                      return (
                        <button key={ep.id} type="button" onClick={() => toggleDupe(ep.id)} className="rounded-lg px-2 py-2 text-center transition-all font-mono text-[0.65rem] border" style={{ background: isSelected ? "#7a9a6e" : "rgba(0,0,0,0.3)", color: isSelected ? "#1c1a14" : "#d4c49a", borderColor: isSelected ? "#a3e635" : "rgba(122,154,110,0.2)" }}>
                          R{ep.grid_row}C{ep.grid_col}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4 mt-2 border-t border-[#7a9a6e]/20 w-full">
              {existingPlanting && onDelete && (
                <button 
                  type="button" 
                  onClick={() => {
                    if(window.confirm("Are you sure you want to delete this planting from the database?")) {
                      onDelete(existingPlanting.id);
                      onClose();
                    }
                  }} 
                  className="flex-shrink-0 px-4 py-3 rounded-lg text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-colors flex items-center justify-center"
                  title="Delete Crop"
                >
                  <Trash2 size={20} />
                </button>
              )}
              <button type="submit" className="flex-1 min-w-0 py-3 rounded-lg font-bold text-[#1c1a14] bg-[#7a9a6e] hover:bg-[#a3e635] transition-colors shadow-lg truncate">
                {existingPlanting ? "Update Database" : plot ? `Plant in ${currentPlotIds.length} Plot${currentPlotIds.length > 1 ? "s" : ""}` : "Save Historical Record"}
              </button>
              <button type="button" onClick={onClose} className="flex-shrink-0 px-6 py-3 rounded-lg text-[#d4c49a] border border-[#d4c49a]/30 hover:bg-[#d4c49a]/10 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
