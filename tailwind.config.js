/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-bg": "#F5F7FB",
        "sidebar-start": "#1D1745",
        "sidebar-end": "#4F46E5",
        "primary": "#4F46E5",
        "primary-dark": "#3B32C6",
        "success": "#22C55E",
        "danger": "#EF4444",
        "warning": "#F59E0B",
        "text-main": "#0F172A",
        "text-muted": "#6B7280",
        "card-border": "#E8ECF5",
      },
      boxShadow: {
        card: "0 8px 24px rgba(15, 23, 42, 0.08)",
        soft: "0 4px 12px rgba(15, 23, 42, 0.08)",
        glow: "0 8px 20px rgba(79, 70, 229, 0.35)",
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

