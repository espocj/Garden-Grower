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
  plot_ids: string[];
  year: number;
  image_url?: string;
  vegetable_name: string;
  emoji?: string;
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

function buildPlots(): Plot[] {
  const plots: Plot[] = [];
  const walkwaySet = new Set<string>();
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

const rawData: Array<Omit<Planting, "id">> = [
  { plot_ids: ["plot-001"], year: 2026, vegetable_name: "Tomato", emoji: "🍅", status_rating: 5, garden_plant_date: "2026-05-15", started_from: "seed", will_plant_again: true },
  { plot_ids: ["plot-003", "plot-004"], year: 2026, vegetable_name: "Bell Pepper", emoji: "🫑", status_rating: 4, garden_plant_date: "2026-05-20", started_from: "plant", will_plant_again: true },
  { plot_ids: ["plot-010", "plot-011", "plot-012"], year: 2025, vegetable_name: "Zucchini", emoji: "🥒", status_rating: 5, garden_plant_date: "2025-05-10", started_from: "seed", will_plant_again: true },
  { plot_ids: ["plot-050"], year: 2024, vegetable_name: "Pumpkin", emoji: "🎃", status_rating: 4, garden_plant_date: "2024-06-05", started_from: "seed", will_plant_again: true },
];

export const MOCK_PLANTINGS: Planting[] = rawData.map((p, i) => ({
  ...p,
  id: `planting-${String(i + 1).padStart(3, "0")}`,
}));
