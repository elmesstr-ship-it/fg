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
          "border-accent": "var(--theme-border-accent)",
          text: "var(--theme-text)",
          "text-muted": "var(--theme-text-muted)",
          "text-subtle": "var(--theme-text-subtle)",
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
        sans: ["Alexandria", "Inter", "system-ui", "sans-serif"],
        alexandria: ["Alexandria", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        grotesk: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.06)",
        float: "0 20px 40px -10px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
