// components/HistoricalDatabase.tsx
"use client";

import { useState, useMemo } from "react";
import { Filter, ArrowUpDown, ChevronDown, ChevronUp, Star, Check, X } from "lucide-react";
import { Planting } from "@/lib/mockData";

interface Props {
  plantings: Planting[];
  onUpdate: (id: string, updates: Partial<Planting>) => void;
}

type SortKey = keyof Planting;
type SortDir = "asc" | "desc";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          style={{
            width: "11px", height: "11px",
            fill: n <= rating ? "var(--gold)" : "transparent",
            color: n <= rating ? "var(--gold)" : "rgba(122,154,110,0.25)",
          }}
        />
      ))}
    </div>
  );
}

export default function HistoricalDatabase({ plantings, onUpdate }: Props) {
  const [yearFilter, setYearFilter]       = useState<string>("all");
  const [vegFilter, setVegFilter]         = useState<string>("all");
  const [sourceFilter, setSourceFilter]   = useState<string>("all");
  const [sortKey, setSortKey]             = useState<SortKey>("year");
  const [sortDir, setSortDir]             = useState<SortDir>("desc");
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  const years = useMemo(() => [...new Set(plantings.map((p) => p.year))].sort((a, b) => b - a), [plantings]);
  const vegs  = useMemo(() => [...new Set(plantings.map((p) => p.vegetable_name))].sort(), [plantings]);

  const filtered = useMemo(() => {
    let data = [...plantings];
    if (yearFilter !== "all") data = data.filter((p) => p.year === Number(yearFilter));
    if (vegFilter  !== "all") data = data.filter((p) => p.vegetable_name === vegFilter);
    if (sourceFilter !== "all") data = data.filter((p) => p.started_from === sourceFilter);

    data.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [plantings, yearFilter, vegFilter, sourceFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  function toggleNotes(id: string) {
    setExpandedNotes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function SortBtn({ col }: { col: SortKey }) {
    const active = sortKey === col;
    return (
      <button
        onClick={() => toggleSort(col)}
        className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
        style={{ color: active ? "var(--mint)" : "var(--sage)" }}
      >
        <ArrowUpDown style={{ width: "10px", height: "10px" }} />
      </button>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div
        className="rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-end"
        style={{ background: "rgba(46,42,30,0.6)", border: "1px solid rgba(122,154,110,0.2)" }}
      >
        <div className="flex items-center gap-2 mr-1">
          <Filter className="w-4 h-4" style={{ color: "var(--sage)" }} />
          <span className="font-mono" style={{ fontSize: "0.68rem", color: "var(--sage)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Filters
          </span>
        </div>

        {/* Year */}
        <div>
          <div className="mb-1" style={{ fontSize: "0.62rem", color: "var(--straw)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Year</div>
          <select
            className="garden-input"
            style={{ width: "auto", paddingRight: "28px" }}
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="all">All Years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Vegetable */}
        <div>
          <div className="mb-1" style={{ fontSize: "0.62rem", color: "var(--straw)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Vegetable</div>
          <select
            className="garden-input"
            style={{ width: "auto", paddingRight: "28px" }}
            value={vegFilter}
            onChange={(e) => setVegFilter(e.target.value)}
          >
            <option value="all">All Vegetables</option>
            {vegs.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        {/* Started From */}
        <div>
          <div className="mb-1" style={{ fontSize: "0.62rem", color: "var(--straw)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Started From</div>
          <select
            className="garden-input"
            style={{ width: "auto", paddingRight: "28px" }}
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="all">All Sources</option>
            <option value="seed">Seed</option>
            <option value="plant">Plant</option>
          </select>
        </div>

        <div className="ml-auto font-mono" style={{ fontSize: "0.7rem", color: "var(--straw)" }}>
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(122,154,110,0.2)" }}
      >
        <div className="overflow-x-auto">
          <table className="history-table w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(46,42,30,0.9)", borderBottom: "1px solid rgba(122,154,110,0.25)" }}>
                {[
                  { label: "Year",        key: "year"           },
                  { label: "Vegetable",   key: "vegetable_name" },
                  { label: "Strain",      key: "strain"         },
                  { label: "Source",      key: "seed_source"    },
                  { label: "From",        key: "started_from"   },
                  { label: "Planted",     key: "garden_plant_date" },
                  { label: "Rating",      key: "status_rating"  },
                  { label: "Again?",      key: "will_plant_again" },
                  { label: "Notes",       key: "notes"          },
                ].map(({ label, key }) => (
                  <th
                    key={key}
                    className="text-left px-4 py-3 whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      <SortBtn col={key as SortKey} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12" style={{ color: "var(--straw)", fontSize: "0.875rem" }}>
                    No records match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => {
                  const notesExpanded = expandedNotes.has(p.id);
                  const rowBg = i % 2 === 0
                    ? "rgba(28,26,20,0.3)"
                    : "rgba(46,42,30,0.2)";

                  return (
                    <tr
                      key={p.id}
                      style={{
                        background: rowBg,
                        borderBottom: "1px solid rgba(122,154,110,0.08)",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(74,103,65,0.15)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = rowBg)}
                    >
                      {/* Year */}
                      <td className="px-4 py-3 font-mono" style={{ fontSize: "0.8rem", color: "var(--straw)", whiteSpace: "nowrap" }}>
                        {p.year}
                      </td>
                      {/* Vegetable */}
                      <td className="px-4 py-3" style={{ fontSize: "0.875rem", color: "var(--cream)", fontWeight: 500, whiteSpace: "nowrap" }}>
                        {p.vegetable_name}
                      </td>
                      {/* Strain */}
                      <td className="px-4 py-3 font-mono" style={{ fontSize: "0.78rem", color: "var(--straw)", whiteSpace: "nowrap" }}>
                        {p.strain ?? <span style={{ color: "rgba(212,196,154,0.35)" }}>—</span>}
                      </td>
                      {/* Seed Source */}
                      <td className="px-4 py-3 font-mono" style={{ fontSize: "0.78rem", color: "var(--straw)", whiteSpace: "nowrap" }}>
                        {p.seed_source ?? <span style={{ color: "rgba(212,196,154,0.35)" }}>—</span>}
                      </td>
                      {/* Started From */}
                      <td className="px-4 py-3">
                        <span
                          className="rounded-full px-2 py-0.5 font-mono capitalize"
                          style={{
                            fontSize: "0.65rem",
                            letterSpacing: "0.06em",
                            background: p.started_from === "seed"
                              ? "rgba(74,103,65,0.35)"
                              : "rgba(160,82,45,0.3)",
                            color: p.started_from === "seed" ? "var(--mint)" : "var(--straw)",
                            border: `1px solid ${p.started_from === "seed" ? "rgba(122,154,110,0.35)" : "rgba(160,82,45,0.35)"}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.started_from}
                        </span>
                      </td>
                      {/* Garden Plant Date */}
                      <td className="px-4 py-3 font-mono" style={{ fontSize: "0.78rem", color: "var(--straw)", whiteSpace: "nowrap" }}>
                        {p.garden_plant_date}
                      </td>
                      {/* Rating */}
                      <td className="px-4 py-3">
                        <StarDisplay rating={p.status_rating ?? 0} />
                      </td>
                      {/* Will Plant Again — editable */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onUpdate(p.id, { will_plant_again: !p.will_plant_again })}
                          className="rounded-full p-1 transition-colors"
                          title={p.will_plant_again ? "Yes — click to toggle" : "No — click to toggle"}
                          style={{
                            background: p.will_plant_again ? "rgba(74,103,65,0.35)" : "rgba(192,57,43,0.2)",
                            border: `1px solid ${p.will_plant_again ? "rgba(122,154,110,0.4)" : "rgba(192,57,43,0.3)"}`,
                          }}
                        >
                          {p.will_plant_again
                            ? <Check style={{ width: "12px", height: "12px", color: "var(--mint)" }} />
                            : <X    style={{ width: "12px", height: "12px", color: "var(--rust)" }} />
                          }
                        </button>
                      </td>
                      {/* Notes — expandable */}
                      <td className="px-4 py-3" style={{ maxWidth: "240px" }}>
                        {p.notes ? (
                          <div>
                            <p
                              style={{
                                fontSize: "0.78rem",
                                color: "var(--straw)",
                                lineHeight: 1.5,
                                overflow: notesExpanded ? "visible" : "hidden",
                                display: notesExpanded ? "block" : "-webkit-box",
                                WebkitLineClamp: notesExpanded ? undefined : 2,
                                WebkitBoxOrient: "vertical" as const,
                              }}
                            >
                              {p.notes}
                            </p>
                            {p.notes.length > 80 && (
                              <button
                                onClick={() => toggleNotes(p.id)}
                                className="flex items-center gap-1 mt-1 transition-opacity hover:opacity-80"
                                style={{ fontSize: "0.65rem", color: "var(--sage)", fontFamily: "var(--font-mono)" }}
                              >
                                {notesExpanded ? (
                                  <><ChevronUp style={{ width: "10px", height: "10px" }} /> Less</>
                                ) : (
                                  <><ChevronDown style={{ width: "10px", height: "10px" }} /> More</>
                                )}
                              </button>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: "rgba(212,196,154,0.35)", fontSize: "0.78rem" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
