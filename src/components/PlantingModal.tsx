"use client";

import { useState, useEffect } from "react";
import { X, Star, Upload, Copy, ChevronDown, Maximize2 } from "lucide-react";
import { MOCK_PLOTS, MOCK_PLANTINGS, Planting, Plot } from "@/lib/mockData";

interface Props {
  plot: Plot;
  existingPlanting?: Planting;
  onClose: () => void;
  onSave: (data: Partial<Planting>) => void;
}

export default function PlantingModal({ plot, existingPlanting, onClose, onSave }: Props) {
  const currentYear = existingPlanting?.year || 2026;
  
  const EMPTY_FORM: Partial<Planting> = {
    plot_ids: [plot.id],
    vegetable_name: "",
    emoji: "",
    strain: "",
    seed_source: "",
    started_from: "seed",
    seed_plant_date: "",
    garden_plant_date: new Date().toISOString().split("T")[0],
    status_rating: 3,
    notes: "",
    will_plant_again: true,
    year: currentYear,
  };

  const [form, setForm] = useState<Partial<Planting>>(existingPlanting ?? EMPTY_FORM);
  const [rating, setRating] = useState(existingPlanting?.status_rating ?? 3);
  const [hoverRating, setHoverRating] = useState(0);
  const [dupeOpen, setDupeOpen] = useState(false);

  // Available empty plots for the duplicate tool
  const occupiedThisYear = new Set(
    MOCK_PLANTINGS.filter(p => p.year === currentYear && p.id !== existingPlanting?.id).flatMap(p => p.plot_ids || [])
  );
  const emptyPlots = MOCK_PLOTS.filter(p => !p.is_walkway && !occupiedThisYear.has(p.id) && p.id !== plot.id);

  function set(key: keyof Planting, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleDupe(plotId: string) {
    const currentIds = form.plot_ids || [plot.id];
    const newIds = currentIds.includes(plotId) 
      ? currentIds.filter(id => id !== plotId) 
      : [...currentIds, plotId];
    set("plot_ids", newIds);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const finalPlotIds = form.plot_ids && form.plot_ids.length > 0 ? form.plot_ids : [plot.id];
    onSave({ ...form, status_rating: rating, plot_ids: finalPlotIds });
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const plotLabel = `Row ${plot.grid_row}, Col ${plot.grid_col}`;
  const currentPlotIds = form.plot_ids || [plot.id];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,8,4,0.75)", backdropFilter: "blur(6px)" }}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl" style={{ background: "linear-gradient(160deg, #1c1a14 0%, #2e2a1e 100%)", border: "1px solid rgba(122,154,110,0.3)", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
        
        {/* Header - Fixed overlapping by using a solid background color */}
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-20 bg-[#1c1a14] border-b border-[#7a9a6e]/20 rounded-t-2xl">
          <div>
            <h2 className="font-display text-xl text-[#f5f2e9]">{existingPlanting ? existingPlanting.vegetable_name : "New Planting"}</h2>
            <p className="font-mono text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase">{plotLabel} · Season {form.year}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-[#d4c49a] hover:bg-[#7a9a6e]/20 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-5">

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

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Vegetable *</label>
              <input className="w-full p-2.5 rounded-lg bg-black/30 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635]" required value={form.vegetable_name ?? ""} onChange={(e) => set("vegetable_name", e.target.value)} />
            </div>
            <div className="sm:col-span-1">
              <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Emoji</label>
              <input className="w-full p-2.5 rounded-lg bg-black/30 border border-[#7a9a6e]/30 text-xl text-center focus:outline-none focus:border-[#a3e635]" value={form.emoji ?? ""} onChange={(e) => set("emoji", e.target.value)} />
            </div>
          </div>

          {/* Restored: Strain & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Strain / Variety</label>
              <input className="w-full p-2.5 rounded-lg bg-black/30 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635]" placeholder="e.g. Brandywine" value={form.strain ?? ""} onChange={(e) => set("strain", e.target.value)} />
            </div>
            <div>
              <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Seed Source</label>
              <input className="w-full p-2.5 rounded-lg bg-black/30 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635]" placeholder="e.g. Baker Creek" value={form.seed_source ?? ""} onChange={(e) => set("seed_source", e.target.value)} />
            </div>
          </div>

          {/* Restored: Smart Dates (Conditional rendering based on 'Seed') */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-[#7a9a6e]/20 bg-[#1c1a14]/50">
            <div>
              <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Started From</label>
              <select 
                className="w-full p-2.5 rounded-lg bg-black/40 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635] outline-none" 
                value={form.started_from ?? "seed"} 
                onChange={(e) => set("started_from", e.target.value as "seed" | "plant")}
              >
                <option value="seed">Seed</option>
                <option value="plant">Plant / Transplant</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Garden Plant Date *</label>
              <input type="date" required className="w-full p-2.5 rounded-lg bg-black/40 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635]" value={form.garden_plant_date ?? ""} onChange={(e) => set("garden_plant_date", e.target.value)} />
            </div>

            {/* Conditionally show Seed Start Date only if they selected "Seed" */}
            {form.started_from === "seed" && (
              <div className="sm:col-span-2 border-t border-[#7a9a6e]/20 pt-4 mt-1">
                <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Seed Start Date</label>
                <input type="date" className="w-full sm:w-1/2 p-2.5 rounded-lg bg-black/40 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635]" value={form.seed_plant_date ?? ""} onChange={(e) => set("seed_plant_date", e.target.value)} />
              </div>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block mb-2 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Status Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" className="outline-none" onMouseEnter={() => setHoverRating(n)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(n)}>
                  <Star className="w-7 h-7" style={{ fill: n <= (hoverRating || rating) ? "#FBBF24" : "transparent", color: n <= (hoverRating || rating) ? "#FBBF24" : "rgba(122,154,110,0.4)", transition: "all 0.15s" }} />
                </button>
              ))}
              <span className="ml-3 font-mono text-[0.75rem] text-[#d4c49a] uppercase tracking-widest">
                {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
              </span>
            </div>
          </div>

          {/* Restored: Notes */}
          <div>
            <label className="block mb-1.5 text-[0.7rem] text-[#7a9a6e] tracking-widest uppercase font-mono">Notes</label>
            <textarea
              className="w-full p-3 rounded-lg bg-black/30 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#a3e635] resize-none"
              rows={3}
              placeholder="Observations, companion plants, problems, tips…"
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          {/* Plot Multi-Select (Duplicates) */}
          {emptyPlots.length > 0 && (
            <div className="rounded-xl p-4 bg-[#4a6741]/10 border border-[#7a9a6e]/20">
              <button type="button" className="flex items-center gap-2 w-full text-left" onClick={() => setDupeOpen(!dupeOpen)}>
                <Copy className="w-4 h-4 flex-shrink-0 text-[#7a9a6e]" />
                <span className="text-[0.8rem] text-[#a3e635] uppercase font-mono tracking-widest">Plot Multi-Select</span>
                <span className="rounded-full px-2 py-0.5 font-mono ml-2 text-[0.6rem] bg-[#7a9a6e] text-black font-bold">
                  {currentPlotIds.length} Linked
                </span>
                <ChevronDown className="w-4 h-4 ml-auto transition-transform text-[#7a9a6e]" style={{ transform: dupeOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
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

          {/* Save/Cancel */}
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 py-3 rounded-lg font-bold text-[#1c1a14] bg-[#7a9a6e] hover:bg-[#a3e635] transition-colors shadow-lg">
              {existingPlanting ? "Update Database" : `Plant in ${currentPlotIds.length} Plot${currentPlotIds.length > 1 ? "s" : ""}`}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg text-[#d4c49a] border border-[#d4c49a]/30 hover:bg-[#d4c49a]/10 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
