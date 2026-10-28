import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Libre Baskerville'", "Georgia", "serif"],
        serif: ["'Libre Baskerville'", "Georgia", "serif"],
        sans: ["'IBM Plex Sans'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'IBM Plex Mono'", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        ivory: {
          50: "#FDFDFB",
          100: "#FBFBF9",
          200: "#F5F4EF",
          300: "#EAE7DF",
          400: "#DDD9CD",
          500: "#C8C2B3",
        },
        navy: {
          50: "#F0F3F9",
          100: "#DCE3F0",
          200: "#B8C7E1",
          300: "#8FA7CE",
          400: "#6082B6",
          500: "#3D629B",
          600: "#2B487B",
          700: "#1E345D",
          800: "#142343",
          850: "#0F1A33",
          900: "#0C152B",
          950: "#070D1E",
        },
        teal: {
          50: "#F0FAF8",
          100: "#E6F5F2",
          200: "#C2E8E0",
          300: "#95D5C8",
          400: "#5EBBAA",
          500: "#2FA08E",
          600: "#138371",
          700: "#0A6355",
          800: "#084C41",
          900: "#053A31",
          950: "#02241E",
        },
        bronze: {
          50: "#FAF7F2",
          100: "#F4EEE2",
          200: "#E8DEC6",
          300: "#D6C6A3",
          400: "#BAA378",
          500: "#9C8353",
          600: "#826B3E",
          700: "#66522E",
          800: "#4D3D21",
        },
      },
      borderRadius: {
        xs: "2px",
        sm: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
