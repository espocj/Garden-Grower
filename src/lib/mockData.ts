// lib/mockData.ts
// ============================================================
// Mock data to populate the UI before Supabase is connected.
// Replace with real Supabase queries once the DB is set up.
// ============================================================

export type StartedFrom = "seed" | "plant";

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
  strain?: string;
  seed_source?: string;
  started_from: StartedFrom;
  seed_plant_date?: string;
  garden_plant_date: string;
  status_rating: number;
  notes?: string;
  will_plant_again: boolean;
}

// ── Grid Layout ──────────────────────────────────────────────
function buildPlots(): Plot[] {
  const plots: Plot[] = [];
  const walkwaySet = new Set<string>();

  // Row 2: cols 2–14 walkway
  for (let c = 2; c <= 14; c++) walkwaySet.add(`2-${c}`);
  // Row 3: col 2 and col 14
  walkwaySet.add("3-2"); walkwaySet.add("3-14");
  // Row 4: cols 2–14 walkway
  for (let c = 2; c <= 14; c++) walkwaySet.add(`4-${c}`);
  // Row 5: col 2 and col 14
  walkwaySet.add("5-2"); walkwaySet.add("5-14");
  // Row 6: cols 2–14 walkway
  for (let c = 2; c <= 14; c++) walkwaySet.add(`6-${c}`);
  // Row 7: col 8
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

// ── Plantings ────────────────────────────────────────────────
// Map plot id to planting for quick lookup
const plantingData: Array<Omit<Planting, "id">> = [
  {
    plot_id: "plot-001", year: 2025, vegetable_name: "Tomato",
    strain: "Brandywine", seed_source: "Baker Creek", started_from: "seed",
    seed_plant_date: "2025-03-01", garden_plant_date: "2025-05-15",
    status_rating: 5, notes: "Excellent yield. Deep rich flavor. Will use same seed stock.", will_plant_again: true,
  },
  {
    plot_id: "plot-002", year: 2025, vegetable_name: "Basil",
    strain: "Genovese", seed_source: "Botanical Interests", started_from: "seed",
    seed_plant_date: "2025-04-01", garden_plant_date: "2025-05-20",
    status_rating: 4, notes: "Great companion for tomatoes. Bolted in late August.", will_plant_again: true,
  },
  {
    plot_id: "plot-003", year: 2025, vegetable_name: "Bell Pepper",
    strain: "California Wonder", seed_source: "Burpee", started_from: "plant",
    garden_plant_date: "2025-05-22",
    status_rating: 3, notes: "Slow to ripen. May need to start earlier indoors.", will_plant_again: true,
  },
  {
    plot_id: "plot-004", year: 2025, vegetable_name: "Zucchini",
    strain: "Black Beauty", seed_source: "Johnny's Seeds", started_from: "seed",
    seed_plant_date: "2025-04-15", garden_plant_date: "2025-05-18",
    status_rating: 5, notes: "Prolific. Shared with neighbors all summer.", will_plant_again: true,
  },
  {
    plot_id: "plot-005", year: 2025, vegetable_name: "Cucumber",
    strain: "Marketmore 76", seed_source: "High Mowing", started_from: "seed",
    seed_plant_date: "2025-04-20", garden_plant_date: "2025-05-25",
    status_rating: 4, notes: "Good production. Watch for powdery mildew mid-season.", will_plant_again: true,
  },
  {
    plot_id: "plot-006", year: 2025, vegetable_name: "Kale",
    strain: "Lacinato", seed_source: "Fedco", started_from: "seed",
    seed_plant_date: "2025-03-10", garden_plant_date: "2025-04-28",
    status_rating: 4, notes: "Thrived in cooler weather. Harvest outer leaves.", will_plant_again: true,
  },
  {
    plot_id: "plot-007", year: 2025, vegetable_name: "Eggplant",
    strain: "Listada de Gandia", seed_source: "Baker Creek", started_from: "plant",
    garden_plant_date: "2025-06-01",
    status_rating: 2, notes: "Flea beetles were a problem. Consider row cover next year.", will_plant_again: false,
  },
  {
    plot_id: "plot-016", year: 2025, vegetable_name: "Lettuce",
    strain: "Butterhead Mix", seed_source: "Territorial Seed", started_from: "seed",
    seed_plant_date: "2025-03-20", garden_plant_date: "2025-04-15",
    status_rating: 5, notes: "Perfect spring crop. Succession planted every 2 weeks.", will_plant_again: true,
  },
  {
    plot_id: "plot-030", year: 2025, vegetable_name: "Pole Beans",
    strain: "Kentucky Wonder", seed_source: "Southern Exposure", started_from: "seed",
    seed_plant_date: "2025-05-01", garden_plant_date: "2025-05-28",
    status_rating: 4, notes: "Heavy harvest. Added trellis mid-season.", will_plant_again: true,
  },
  {
    plot_id: "plot-045", year: 2025, vegetable_name: "Carrot",
    strain: "Danvers 126", seed_source: "High Mowing", started_from: "seed",
    seed_plant_date: "2025-04-05", garden_plant_date: "2025-04-05",
    status_rating: 3, notes: "Germination spotty. Thin more aggressively.", will_plant_again: true,
  },
  {
    plot_id: "plot-046", year: 2025, vegetable_name: "Swiss Chard",
    strain: "Rainbow", seed_source: "Renee's Garden", started_from: "seed",
    seed_plant_date: "2025-03-25", garden_plant_date: "2025-04-30",
    status_rating: 5, notes: "Beautiful and productive all season long.", will_plant_again: true,
  },
  {
    plot_id: "plot-060", year: 2025, vegetable_name: "Pumpkin",
    strain: "Sugar Pie", seed_source: "Burpee", started_from: "seed",
    seed_plant_date: "2025-05-10", garden_plant_date: "2025-06-05",
    status_rating: 4, notes: "Vines sprawled. Give more space or trellis vertically.", will_plant_again: true,
  },
  // Historical entries (2024)
  {
    plot_id: "plot-001", year: 2024, vegetable_name: "Tomato",
    strain: "Cherokee Purple", seed_source: "Baker Creek", started_from: "seed",
    seed_plant_date: "2024-03-05", garden_plant_date: "2024-05-18",
    status_rating: 4, notes: "Beautiful color, great flavor. Cracked after heavy rain.", will_plant_again: true,
  },
  {
    plot_id: "plot-002", year: 2024, vegetable_name: "Marigold",
    strain: "French Dwarf", seed_source: "Botanical Interests", started_from: "seed",
    seed_plant_date: "2024-04-01", garden_plant_date: "2024-05-15",
    status_rating: 5, notes: "Excellent pest deterrent. Will border every bed.", will_plant_again: true,
  },
  {
    plot_id: "plot-003", year: 2024, vegetable_name: "Jalapeño",
    strain: "Mucho Nacho", seed_source: "Burpee", started_from: "plant",
    garden_plant_date: "2024-05-22",
    status_rating: 5, notes: "Incredibly productive. Pickled most of the harvest.", will_plant_again: true,
  },
];

export const MOCK_PLANTINGS: Planting[] = plantingData.map((p, i) => ({
  ...p,
  id: `planting-${String(i + 1).padStart(3, "0")}`,
}));

// Quick lookup: plotId → current year planting
export function getPlantingForPlot(plotId: string, year = 2025): Planting | undefined {
  return MOCK_PLANTINGS.find((p) => p.plot_id === plotId && p.year === year);
}
