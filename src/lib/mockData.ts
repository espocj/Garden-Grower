// lib/mockData.ts

export type StartedFrom = "seed" | "plant";
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
  emoji?: string;      // Added for custom emoji support
  category?: PlantCategory; 
  strain?: string;
  seed_source?: string;
  started_from: StartedFrom;
  seed_plant_date?: string;
  garden_plant_date: string;
  status_rating: number;
  notes?: string;
  will_plant_again: boolean;
}

// ── Grid Layout Logic ─────────────────────────────────────────
function buildPlots(): Plot[] {
  const plots: Plot[] = [];
  const walkwaySet = new Set<string>();

  // Define walkways based on your specific garden layout
  for (let c = 2; c <= 14; c++) walkwaySet.add(`2-${c}`);
  walkwaySet.add("3-2"); walkwaySet.add("3-14");
  for (let c = 2; c <= 14; c++) walkwaySet.add(`4-${c}`);
  walkwaySet.add("5-2"); walkwaySet.add("5-14");
  for (let c = 2; c <= 14; c++) walkwaySet.add(`6-${c}`);
  walkwaySet.add("7-8");

  let idCounter = 1;
  for (let r = 1; r <= 7; r++) {
    for (let c = 1; c <= 15; c++) {
      plots.push({
        id: `plot-${String(idCounter).padStart(3, "0")}`,
        grid_row: r,
        grid_col: c,
        is_walkway: walkwaySet.has(`${r}-${c}`),
      });
      idCounter++;
    }
  }
  return plots;
}

export const MOCK_PLOTS: Plot[] = buildPlots();

// ── Initial Mock Plantings ────────────────────────────────────
const initialData: Array<Omit<Planting, "id">> = [
  {
    plot_id: "plot-001", year: 2026, vegetable_name: "Tomato",
    emoji: "🍅", category: "Vegetable", strain: "Brandywine", 
    seed_source: "Baker Creek", started_from: "seed",
    garden_plant_date: "2026-05-15", status_rating: 5, will_plant_again: true,
  },
  {
    plot_id: "plot-002", year: 2026, vegetable_name: "Basil",
    emoji: "🌿", category: "Herb", strain: "Genovese", 
    seed_source: "Botanical Interests", started_from: "seed",
    garden_plant_date: "2026-05-20", status_rating: 4, will_plant_again: true,
  },
  {
    plot_id: "plot-003", year: 2026, vegetable_name: "Bell Pepper",
    emoji: "🫑", category: "Vegetable", strain: "California Wonder", 
    started_from: "plant", garden_plant_date: "2026-05-22",
    status_rating: 3, will_plant_again: true,
  },
  {
    plot_id: "plot-004", year: 2026, vegetable_name: "Zucchini",
    emoji: "🥒", category: "Vegetable", strain: "Black Beauty", 
    started_from: "seed", garden_plant_date: "2026-05-18",
    status_rating: 5, will_plant_again: true,
  },
  {
    plot_id: "plot-005", year: 2026, vegetable_name: "Cucumber",
    emoji: "🥒", category: "Vegetable", strain: "Marketmore 76", 
    started_from: "seed", garden_plant_date: "2026-05-25",
    status_rating: 4, will_plant_again: true,
  },
  {
    plot_id: "plot-006", year: 2026, vegetable_name: "Kale",
    emoji: "🥬", category: "Vegetable", strain: "Lacinato", 
    started_from: "seed", garden_plant_date: "2026-04-28",
    status_rating: 4, will_plant_again: true,
  }
];

export const MOCK_PLANTINGS: Planting[] = initialData.map((p, i) => ({
  ...p,
  id: `planting-${String(i + 1).padStart(3, "0")}`,
}));

export function getPlantingForPlot(plotId: string, year = 2026): Planting | undefined {
  return MOCK_PLANTINGS.find((p) => p.plot_id === plotId && p.year === year);
}
