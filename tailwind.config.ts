import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta IntegraIA by EMET
        navy: {
          950: "#030712",
          900: "#060d1f",
          800: "#0a1630",
          700: "#102244",
          600: "#17305c",
        },
        cyan: {
          electric: "#00E5FF",
        },
        teal: {
          brand: "#0FB5AE",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #00E5FF 0%, #0FB5AE 100%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0,229,255,.25), 0 8px 32px -8px rgba(0,229,255,.35)",
      },
    },
  },
  plugins: [],
};

export default config;
