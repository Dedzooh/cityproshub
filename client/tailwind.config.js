/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // scan all app files
  ],

  darkMode: "class", // keeps your toggle functional

  theme: {
    extend: {
      colors: {
        // 🌿 Teal → Blue signature palette (premium yet calm)
        brand: {
          light: "#5eead4", // accent teal glow
          DEFAULT: "#14b8a6", // main teal
          dark: "#0f766e", // dark teal (for buttons)
        },
        bluebrand: {
          light: "#60a5fa",
          DEFAULT: "#3b82f6",
          dark: "#1d4ed8",
        },
        accent: {
          100: "#e0f2fe",
          200: "#bae6fd",
          500: "#38bdf8", // for hover glow
        },
        dark: {
          700: "#1e293b",
          800: "#0f172a",
          900: "#020617",
        },
        gray: {
          50: "#f8fafc",
          100: "#f1f5f9",
          300: "#cbd5e1",
          500: "#64748b",
          700: "#334155",
        },
      },

      // 🎨 Gradients & Shadows
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #14b8a6 0%, #3b82f6 50%, #1d4ed8 100%)",
        "card-glow":
          "radial-gradient(circle at top left, rgba(20,184,166,0.15), transparent 60%)",
        "footer-gradient":
          "linear-gradient(to right, #ccfbf1, #dbeafe, #e0f2fe)",
      },

      boxShadow: {
        soft: "0 4px 12px rgba(0,0,0,0.06)",
        smooth: "0 6px 20px rgba(20,184,166,0.25)",
        glow: "0 0 18px rgba(56,189,248,0.3)",
      },

      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },

      transitionDuration: {
        400: "400ms",
      },
    },
  },

  plugins: [
    // 🎯 Add line clamping (for text truncation on cards)
    require("@tailwindcss/line-clamp"),
    // 🎯 Add form styling improvements
    require("@tailwindcss/forms"),
  ],
};
