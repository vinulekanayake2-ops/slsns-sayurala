import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#020c1b", // Deepest Navy
          800: "#0a192f", // Deep Navy
          700: "#112240", // Light Navy/Steel base
          600: "#233554", // Lighter
        },
        steel: {
          100: "#ccd6f6", // Lightest Text
          200: "#8892b0", // Slate Text
          DEFAULT: "#4a90e2", // Steel Blue
        },
        gold: {
          DEFAULT: "#ffd700", // Standard Gold
          400: "#ffecb3",
          500: "#ffd700",
          600: "#d4af37", // Metallic Gold
        },
        accent: "#64ffda",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-montserrat)", "sans-serif"], 
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
