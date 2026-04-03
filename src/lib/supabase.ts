
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Type helpers ─────────────────────────────────────────────
export type Database = {
  public: {
    Tables: {
      plots: {
        Row: {
          id: string;
          grid_row: number;
          grid_col: number;
          is_walkway: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["plots"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["plots"]["Insert"]>;
      };
      plantings: {
        Row: {
          id: string;
          plot_id: string;
          year: number;
          image_url: string | null;
          vegetable_name: string;
          strain: string | null;
          seed_source: string | null;
          started_from: "seed" | "plant";
          seed_plant_date: string | null;
          garden_plant_date: string;
          status_rating: number | null;
          notes: string | null;
          will_plant_again: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["plantings"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["plantings"]["Insert"]>;
      };
    };
  };
};
