import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "var(--theme-bg)",
          surface: "var(--theme-surface)",
          "surface-elevated": "var(--theme-surface-elevated)",
          border: "var(--theme-border)",
          text: "var(--theme-text)",
          "text-muted": "var(--theme-text-muted)",
          primary: "var(--theme-primary)",
          "primary-hover": "var(--theme-primary-hover)",
          "primary-contrast": "var(--theme-primary-contrast)",
          gold: "var(--theme-gold)",
          "gold-light": "var(--theme-gold-light)",
          "gold-dark": "var(--theme-gold-dark)",
          accent: "var(--theme-accent)",
          danger: "var(--theme-danger)",
          success: "var(--theme-success)",
        },
      },
      fontFamily: {
        serif: ["Alexandria", "Cinzel", "serif"],
        sans: ["Alexandria", "Inter", "sans-serif"],
        alexandria: ["Alexandria", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        cinzel: ["Cinzel", "serif"],
      },
      boxShadow: {
        sacred: "0 4px 20px -2px rgba(212, 175, 55, 0.15)",
        "sacred-lg": "0 10px 30px -5px rgba(212, 175, 55, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
