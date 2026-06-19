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
        ocean: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        coral: {
          50: "#fff7ed",
          500: "#f97316",
          600: "#ea580c",
        },
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "card-hover":
          "0 4px 12px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
      },
      keyframes: {
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "celebrate-pop": {
          "0%": { opacity: "0", transform: "scale(0.6) rotate(-12deg)" },
          "60%": { opacity: "1", transform: "scale(1.2) rotate(6deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
      },
      animation: {
        "toast-in": "toast-in 0.4s ease-out",
        "celebrate-pop": "celebrate-pop 0.65s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
