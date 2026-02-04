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
        // Paleta personalizada MecMain / MotoRiders
        // Fondo principal oscuro (casi negro con tinte azulado)
        background: "#0B0E11", 
        // Superficies (Cards) ligeramente más claras
        surface: "#151A21",
        // Acento principal (Verde Neón del mock)
        primary: {
          DEFAULT: "#00E599", // Verde vibrante
          hover: "#00C482",
          foreground: "#000000", // Texto sobre el verde
        },
        // Secundario (Gris azulado)
        secondary: {
          DEFAULT: "#1E293B",
          foreground: "#FFFFFF",
        },
        muted: "#94A3B8",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #00E59933 0deg, #00000000 180deg)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'], // Asumiendo Inter o similar
      }
    },
  },
  plugins: [],
};
export default config;