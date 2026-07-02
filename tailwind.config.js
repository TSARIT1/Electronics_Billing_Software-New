/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-bg": "rgb(var(--color-app-bg) / <alpha-value>)",
        "surface": "rgb(var(--color-surface) / <alpha-value>)",
        "surface-alt": "rgb(var(--color-surface-alt) / <alpha-value>)",
        "sidebar-start": "rgb(var(--color-sidebar-start) / <alpha-value>)",
        "sidebar-end": "rgb(var(--color-sidebar-end) / <alpha-value>)",
        "primary": "#f59e0b",
        "primary-dark": "#d97706",
        "success": "#22C55E",
        "danger": "#EF4444",
        "warning": "#F59E0B",
        "text-main": "rgb(var(--color-text-main) / <alpha-value>)",
        "text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
        "card-border": "rgb(var(--color-card-border) / <alpha-value>)",
      },
      boxShadow: {
        card: "0 8px 24px rgba(245, 158, 11, 0.05)",
        soft: "0 4px 12px rgba(245, 158, 11, 0.05)",
        glow: "0 8px 20px rgba(245, 158, 11, 0.3)",
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
    },
  },
  plugins: [],
}

