import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["DM Mono", "Courier New", "monospace"],
      },
      colors: {
        soil:      "#1C1A14",
        bark:      "#2E2A1E",
        moss:      "#3A4A2E",
        fern:      "#4D6741",
        sage:      "#7A9A6E",
        mint:      "#A8C49A",
        cream:     "#F5F0E8",
        parchment: "#EDE7D8",
        straw:     "#D4C49A",
        rust:      "#A0522D",
        amber:     "#C8860A",
        sky:       "#6B9DBF",
        storm:     "#4A7A9B",
        frost:     "#B8D4E8",
        gold:      "#E8C547",
      },
    },
  },
  plugins: [],
};

export default config;
