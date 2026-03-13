/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Inter'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        harvest: {
          50: "#fffbeb",
          100: "#fff4c6",
          200: "#ffe88d",
          300: "#fed554",
          400: "#fec449",
          500: "#f5a20e",
          600: "#d97f06",
          700: "#b45c04",
          800: "#924809",
          900: "#783c0b",
          950: "#431e04",
        },
        earth: {
          50: "#eef3ff",
          100: "#dce8ff",
          200: "#b2ccff",
          300: "#7aaafd",
          400: "#4a82fc", // original
          500: "#2d65f0",
          600: "#1e4fd8",
          700: "#1840b0",
          800: "#172e80",
          900: "#182b5c",
          950: "#0f1a38", 
        },
        forest: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
