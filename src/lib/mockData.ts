export type StartedFrom = "seed" | "plant";

// New Category types for the "Smart Logic"
export type PlantCategory = "Vegetable" | "Herb" | "Fruit" | "Flower" | "Other";

export interface Plot {
  id: string;
  grid_row: number;
  grid_col: number;
  is_walkway: boolean;
}

export interface Planting {
  id: string;
  plot_id: string;
  year: number;
  image_url?: string;
  vegetable_name: string;
  emoji?: string;      // Fixes the TypeScript error
  category?: PlantCategory; // For the smart category logic
  strain?: string;
  seed_source?: string;
  started_from: StartedFrom;
  seed_plant_date?: string;
  garden_plant_date: string;
  status_rating: number;
  notes?: string;
  will_plant_again: boolean;
}
