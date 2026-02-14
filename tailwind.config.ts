import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D4A574",
          light: "#E8C9A0",
          dark: "#B8865A",
        },
        background: "#FEFDFB",
        surface: {
          DEFAULT: "#F7F4F0",
          dark: "#E8E3DC",
        },
        "text-primary": "#3E3530",
        "text-secondary": "#6B615B",
        "text-muted": "#9B918A",
        "accent-success": "#7A9B76",
        "accent-warning": "#D89B6A",
        "accent-danger": "#C77567",
        "safety-high": "#7A9B76",
        "safety-medium": "#D4A574",
        "safety-low": "#C77567",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        accent: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      boxShadow: {
        soft: "0 4px 6px rgba(0,0,0,0.07)",
        "soft-lg": "0 20px 40px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
