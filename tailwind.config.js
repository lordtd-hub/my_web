/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#15212f",
        "academic-blue": "#1f5f8b",
        "paper-warm": "#f7f4ee",
        "sage-line": "#b9c8bd",
        "copper-accent": "#b45f3a",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px rgba(21, 33, 47, 0.12)",
      },
    },
  },
  plugins: [],
};
