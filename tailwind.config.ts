import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans:    ["var(--font-inter)", ...fontFamily.sans],
        heading: ["var(--font-poppins)", ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: "#2D6A4F", // Deep Leaf Green
          light: "#40916C",
          dark: "#1B4332",
        },
        secondary: {
          DEFAULT: "#E9B44C", // Harvest Gold
          light: "#F0C873",
          dark: "#B88314",
        },
        accent: {
          DEFAULT: "#A47551", // Soil Brown
          light: "#BC987E",
          dark: "#7B5537",
        },
        sage: {
          DEFAULT: "#DDE5D4", // Soft Sage
          light: "#EFF3EC",
          dark: "#B8C5AE",
        },
        offwhite: {
          DEFAULT: "#F8F9FA", // Off-white
          dark: "#E9ECEF",
        },
        background: "#F8F9FA",
        foreground: "#1A1A1A",
      },
      borderRadius: {
        "2xl": "24px", // Rounded 24px cards as requested
        "3xl": "32px",
      },
      boxShadow: {
        "morph-light": "8px 8px 16px #e0e0e0, -8px -8px 16px #ffffff",
        "morph-dark": "8px 8px 16px #151515, -8px -8px 16px #252525",
        "glass": "0 8px 32px rgba(45, 106, 79, 0.15)", // Request: box-shadow: 0 8px 32px rgba(45,106,79,0.15)
        "glass-soft": "0 4px 20px rgba(0, 0, 0, 0.05)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        "spin-slow": "spin 12s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
