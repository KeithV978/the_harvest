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
          50: "#e8fbfd",
          100: "#c4f4f9",
          200: "#8eeaf3",
          300: "#4fdced",
          400: "#1ECBE1", // your original
          500: "#14a3b8",
          600: "#0d7f91",
          700: "#096170",
          800: "#064a56",
          900: "#03303a",
          950: "#011a20",
        },
        earth: {
          50: "#fdf1ef",
          100: "#fad9d4",
          200: "#f4ada3",
          300: "#ec7a6b",
          400: "#e55240",
          500: "#e1341e", // your original
          600: "#c12a18",
          700: "#9e2113",
          800: "#7a190e",
          900: "#561108",
          950: "#300804",
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
