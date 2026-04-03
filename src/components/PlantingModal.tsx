"use client";

import { useState, useEffect } from "react";
import { X, Star, Upload, Copy, ChevronDown } from "lucide-react";
import { MOCK_PLOTS, MOCK_PLANTINGS, Planting, Plot } from "@/lib/mockData";

interface Props {
  plot: Plot;
  existingPlanting?: Planting;
  onClose: () => void;
  onSave: (data: Partial<Planting>, duplicatePlotIds: string[]) => void;
}

export default function PlantingModal({ plot, existingPlanting, onClose, onSave }: Props) {
  // Dynamically set the year based on the planting, defaulting to 2026
  const currentYear = existingPlanting?.year || 2026;
  
  const EMPTY_FORM: Partial<Planting> = {
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
  const [selectedDupes, setSelectedDupes] = useState<string[]>([]);
  const [dupeOpen, setDupeOpen] = useState(false);

  // BUG FIX 2: Check occupied plots dynamically against currentYear instead of hardcoded 2025
  const occupiedThisYear = new Set(
    MOCK_PLANTINGS.filter((p) => p.year === currentYear).map((p) => p.plot_id)
  );
  const emptyPlots = MOCK_PLOTS.filter(
    (p) => !p.is_walkway && p.id !== plot.id && !occupiedThisYear.has(p.id)
  );

  function set(key: keyof Planting, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleDupe(plotId: string) {
    setSelectedDupes((prev) =>
      prev.includes(plotId) ? prev.filter((id) => id !== plotId) : [...prev, plotId]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ ...form, status_rating: rating, plot_id: plot.id }, selectedDupes);
    onClose();
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const plotLabel = `Row ${plot.grid_row}, Col ${plot.grid_col}`;

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,8,4,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="modal-panel relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          background: "linear-gradient(160deg, #1c1a14 0%, #2e2a1e 100%)",
          border: "1px solid rgba(122,154,110,0.3)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(245,240,232,0.06)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 pt-6 pb-4 sticky top-0 z-10"
          style={{
            background: "linear-gradient(160deg, #1c1a14 0%, transparent 100%)",
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid rgba(122,154,110,0.15)",
          }}
        >
          <div>
            <h2 className="font-display text-xl" style={{ color: "#f5f2e9" }}>
              {existingPlanting ? existingPlanting.vegetable_name : "New Planting"}
            </h2>
            <p className="font-mono" style={{ fontSize: "0.7rem", color: "#7a9a6e", letterSpacing: "0.08em" }}>
              {plotLabel} · {form.year}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors"
            style={{ color: "#d4c49a" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(122,154,110,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-5">

          {/* BUG FIX 1: Working Image Upload */}
          <label
            className="rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors relative overflow-hidden"
            style={{
              height: "120px",
              border: "2px dashed rgba(122,154,110,0.3)",
              background: "rgba(28,26,20,0.4)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#7a9a6e")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(122,154,110,0.3)")}
          >
            {form.image_url ? (
              <img src={form.image_url} alt="Crop Preview" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <Upload className="w-6 h-6" style={{ color: "#7a9a6e" }} />
                <span style={{ fontSize: "0.8rem", color: "#d4c49a" }}>Upload photo (optional)</span>
              </>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) set("image_url", URL.createObjectURL(file));
              }} 
            />
          </label>

          {/* Row: vegetable + emoji + strain */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block mb-1.5" style={{ fontSize: "0.72rem", color: "#7a9a6e", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                Vegetable *
              </label>
              <input
                className="garden-input w-full p-2 rounded bg-black/20 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#7a9a6e]"
                required
                placeholder="e.g. Tomato"
                value={form.vegetable_name ?? ""}
                onChange={(e) => set("vegetable_name", e.target.value)}
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block mb-1.5" style={{ fontSize: "0.72rem", color: "#7a9a6e", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                Emoji
              </label>
              <input
                className="garden-input w-full p-2 rounded bg-black/20 border border-[#7a9a6e]/30 text-[#f5f2e9] text-center focus:outline-none focus:border-[#7a9a6e]"
                placeholder="🍅"
                value={form.emoji ?? ""}
                onChange={(e) => set("emoji", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5" style={{ fontSize: "0.72rem", color: "#7a9a6e", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                Strain / Variety
              </label>
              <input
                className="garden-input w-full p-2 rounded bg-black/20 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#7a9a6e]"
                placeholder="e.g. Brandywine"
                value={form.strain ?? ""}
                onChange={(e) => set("strain", e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1.5" style={{ fontSize: "0.72rem", color: "#7a9a6e", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                Seed Source
              </label>
              <input
                className="garden-input w-full p-2 rounded bg-black/20 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#7a9a6e]"
                placeholder="e.g. Baker Creek"
                value={form.seed_source ?? ""}
                onChange={(e) => set("seed_source", e.target.value)}
              />
            </div>
          </div>

          {/* BUG FIX 3: Prevent Overlapping Dates with sm:grid-cols-2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5" style={{ fontSize: "0.72rem", color: "#7a9a6e", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                Seed / Start Date
              </label>
              <input
                type="date"
                className="garden-input w-full p-2 rounded bg-black/20 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#7a9a6e]"
                value={form.seed_plant_date ?? ""}
                onChange={(e) => set("seed_plant_date", e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1.5" style={{ fontSize: "0.72rem", color: "#7a9a6e", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                Garden Plant Date *
              </label>
              <input
                type="date"
                className="garden-input w-full p-2 rounded bg-black/20 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#7a9a6e]"
                required
                value={form.garden_plant_date ?? ""}
                onChange={(e) => set("garden_plant_date", e.target.value)}
              />
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block mb-2" style={{ fontSize: "0.72rem", color: "#7a9a6e", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
              Status Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="star-btn outline-none"
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(n)}
                >
                  <Star
                    className="w-7 h-7"
                    style={{
                      fill: n <= (hoverRating || rating) ? "#FBBF24" : "transparent",
                      color: n <= (hoverRating || rating) ? "#FBBF24" : "rgba(122,154,110,0.4)",
                      transition: "fill 0.15s, color 0.15s",
                    }}
                  />
                </button>
              ))}
              <span className="ml-2 font-mono" style={{ fontSize: "0.75rem", color: "#d4c49a" }}>
                {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1.5" style={{ fontSize: "0.72rem", color: "#7a9a6e", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
              Notes
            </label>
            <textarea
              className="garden-input w-full p-2 rounded bg-black/20 border border-[#7a9a6e]/30 text-[#f5f2e9] focus:outline-none focus:border-[#7a9a6e] resize-none"
              rows={3}
              placeholder="Observations, companion plants, problems, tips…"
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          {/* Will Plant Again */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="will-plant"
              className="w-4 h-4 accent-[#4a6741]"
              checked={form.will_plant_again ?? true}
              onChange={(e) => set("will_plant_again", e.target.checked)}
            />
            <label
              htmlFor="will-plant"
              style={{ fontSize: "0.875rem", color: "#f5f2e9", cursor: "pointer" }}
            >
              Will Plant Again
            </label>
          </div>

          {/* ── Duplicate Panel ─────────────────────────────── */}
          {emptyPlots.length > 0 && (
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(74,103,65,0.12)", border: "1px solid rgba(122,154,110,0.2)" }}
            >
              <button
                type="button"
                className="flex items-center gap-2 w-full text-left"
                onClick={() => setDupeOpen((o) => !o)}
              >
                <Copy className="w-4 h-4 flex-shrink-0" style={{ color: "#7a9a6e" }} />
                <span style={{ fontSize: "0.875rem", color: "#a3e635", fontWeight: 500 }}>
                  Duplicate this planting to other plots
                </span>
                {selectedDupes.length > 0 && (
                  <span
                    className="rounded-full px-2 py-0.5 font-mono ml-1"
                    style={{ fontSize: "0.65rem", background: "#4a6741", color: "#f5f2e9" }}
                  >
                    {selectedDupes.length} selected
                  </span>
                )}
                <ChevronDown
                  className="w-4 h-4 ml-auto transition-transform"
                  style={{
                    color: "#7a9a6e",
                    transform: dupeOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {dupeOpen && (
                <div className="mt-3 grid grid-cols-3 gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {emptyPlots.map((ep) => {
                    const isSelected = selectedDupes.includes(ep.id);
                    return (
                      <button
                        key={ep.id}
                        type="button"
                        className="rounded-lg px-2 py-1.5 text-left transition-colors font-mono"
                        style={{
                          fontSize: "0.68rem",
                          background: isSelected ? "#4a6741" : "rgba(28,26,20,0.5)",
                          color: isSelected ? "#f5f2e9" : "#d4c49a",
                          border: `1px solid ${isSelected ? "#7a9a6e" : "rgba(122,154,110,0.2)"}`,
                        }}
                        onClick={() => toggleDupe(ep.id)}
                      >
                        R{ep.grid_row}·C{ep.grid_col}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button 
              type="submit" 
              className="flex-1 py-2 rounded font-bold text-[#1c1a14] bg-[#7a9a6e] hover:bg-[#a3e635] transition-colors"
            >
              {selectedDupes.length > 0
                ? `Save & Duplicate to ${selectedDupes.length} plot${selectedDupes.length > 1 ? "s" : ""}`
                : "Save Planting"}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 rounded text-[#d4c49a] border border-[#d4c49a]/30 hover:bg-[#d4c49a]/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
