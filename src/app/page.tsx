"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Leaf, ChevronDown, LogOut } from "lucide-react";
import WeatherBanner from "@/components/WeatherBanner";
import GardenGrid from "@/components/GardenGrid";
import HistoricalDatabase from "@/components/HistoricalDatabase";
import Login from "@/components/Login";
import { Planting, MOCK_PLOTS } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";

type Tab = "garden" | "history";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("garden");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [plantings, setPlantings] = useState<Planting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const availableYears = useMemo(() => [2030, 2029, 2028, 2027, 2026, 2025, 2024], []);

  // 1. Listen for Authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Live Data from Supabase
  const fetchPlantings = useCallback(async () => {
    if (!session?.user) return;
    
    setIsLoading(true);
    // Row Level Security ensures this ONLY gets rows where user_id matches the logged-in user
    const { data, error } = await supabase
      .from('plantings')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error("Error fetching data:", error);
    } else if (data) {
      setPlantings(data as Planting[]);
    }
    setIsLoading(false);
  }, [session]);

  useEffect(() => {
    if (session) fetchPlantings();
  }, [session, fetchPlantings]);

  // 3. Save directly to Supabase
  const handleSave = useCallback(async (data: Partial<Planting>) => {
    if (!session?.user) return;

    const payload = {
      user_id: session.user.id,
      year: currentYear,
      plot_ids: data.plot_ids || [],
      vegetable_name: data.vegetable_name ?? "",
      emoji: data.emoji || null,
      strain: data.strain || null,
      seed_source: data.seed_source || null,
      started_from: data.started_from ?? "seed",
      seed_plant_date: data.seed_plant_date || null,
      garden_plant_date: data.garden_plant_date ?? new Date().toISOString().split("T")[0],
      status_rating: data.status_rating ?? 3,
      notes: data.notes || null,
      will_plant_again: data.will_plant_again ?? true,
    };

    // If data.id exists and isn't a local mock string, update the row
    if (data.id && !data.id.startsWith('planting-')) {
      await supabase.from('plantings').update(payload).eq('id', data.id);
    } else {
      // Otherwise insert a new row
      await supabase.from('plantings').insert([payload]);
    }

    // Refresh data after saving
    fetchPlantings();
  }, [currentYear, session, fetchPlantings]);

  // Ensure user is logged in before rendering the main app
  if (!session) {
    return <Login />;
  }

  const currentYearPlantings = plantings.filter((p) => p.year === currentYear);
  const totalPlots = MOCK_PLOTS.filter((p) => !p.is_walkway).length;
  const plantedCount = new Set(currentYearPlantings.flatMap(p => p.plot_ids)).size;

  return (
    <div className="min-h-screen flex flex-col bg-[#c4b396] text-[#2d241e]">
      <nav className="sticky top-0 z-50 bg-[#c4b396]/95 backdrop-blur-md border-b border-[#3e2723]/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#3e2723] flex items-center justify-center shadow-md">
                <Leaf className="w-4 h-4 text-[#94a77e]" />
              </div>
              <div className="hidden sm:block">
                <div className="font-display text-sm font-bold text-[#3e2723]">Garden Dashboard</div>
                <div className="text-[10px] font-mono text-[#3e2723]/60 uppercase tracking-widest leading-none">Bedford Station</div>
              </div>
            </div>

            <div className="relative">
              <select 
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="appearance-none bg-[#3e2723]/10 border border-[#3e2723]/20 rounded-md px-3 py-1.5 pr-9 font-mono text-[11px] text-[#3e2723] font-bold focus:outline-none cursor-pointer outline-none"
              >
                {availableYears.map(y => <option key={y} value={y} className="bg-[#c4b396]">SEASON {y}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-2.5 text-[#3e2723]/40 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => setActiveTab("garden")} className={`px-4 py-2 text-[11px] font-mono tracking-widest transition-all ${activeTab === "garden" ? "text-[#3e2723] border-b-2 border-[#3e2723]" : "text-[#3e2723]/40 hover:text-[#3e2723]"}`}>
              GARDEN VIEW
            </button>
            <button onClick={() => setActiveTab("history")} className={`px-4 py-2 text-[11px] font-mono tracking-widest transition-all ${activeTab === "history" ? "text-[#3e2723] border-b-2 border-[#3e2723]" : "text-[#3e2723]/40 hover:text-[#3e2723]"}`}>
              HISTORY
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#3e2723] font-bold bg-[#3e2723]/5 rounded-full px-4 py-1.5 border border-[#3e2723]/10">
              {isLoading ? "Syncing..." : `${plantedCount} / ${totalPlots} PLOTS`}
            </div>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="p-1.5 text-[#3e2723]/40 hover:text-[#3e2723] transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>

      <WeatherBanner />

      <main className="flex-1 w-full max-w-full mx-auto px-4 py-6">
        {activeTab === "garden" ? (
          <GardenGrid plantings={currentYearPlantings} onSave={handleSave} />
        ) : (
          <HistoricalDatabase plantings={plantings} onSave={handleSave} />
        )}
      </main>

      <footer className="py-8 text-center text-[10px] font-mono text-[#3e2723]/30 uppercase tracking-[0.3em] border-t border-[#3e2723]/5">
        Bedford Garden Tracker • Season {currentYear}
      </footer>
    </div>
  );
}
