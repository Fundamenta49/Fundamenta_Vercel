import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Lora', 'serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        navy: {
          DEFAULT: "#1E3A8A",
          50: "#E8F0FF",
          100: "#C7D9F5",
          200: "#96B4E7",
          300: "#6A8FD5",
          400: "#4771C2",
          500: "#1E3A8A",
          600: "#162C6B",
          700: "#0F1F4D",
          800: "#08112E",
          900: "#02040F",
        },
        wood: {
          DEFAULT: "hsl(var(--wood))",
          foreground: "hsl(var(--foreground))",
          light: "hsl(var(--wood-light))",
          dark: "hsl(var(--wood-dark))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "#1A1A1A",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "#1A1A1A",
          light: "hsl(var(--secondary-light))",
          dark: "hsl(var(--secondary-dark))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "#1A1A1A",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        // Section-specific colors
        emergency: "#b91c1c", // Red
        financial: "#3b82f6", // Blue
        wellness: "#10b981", // Green
        career: "#8b5cf6", // Purple
        learning: "#f59e0b", // Yellow
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      boxShadow: {
        'custom-sm': 'var(--shadow-sm)',
        'custom-md': 'var(--shadow-md)',
        'custom-lg': 'var(--shadow-lg)',
      },
      keyframes: {
        "swipe-hint": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(5px)" },
        },
        "pulse-slow": {
          "0%": { opacity: "0.3", transform: "scale(1.2)" },
          "25%": { opacity: "0.5", transform: "scale(1.25)" },
          "50%": { opacity: "0.7", transform: "scale(1.3)" },
          "75%": { opacity: "0.5", transform: "scale(1.25)" },
          "100%": { opacity: "0.3", transform: "scale(1.2)" },
        },
      },
      animation: {
        "swipe-hint": "swipe-hint 1.5s ease-in-out infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;