/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#F2A81D",
          teal: "#3FB8A8",
          rose: "#D42A52",
          crimson: "#D42A52",
          navy: "#1B1F4A",
          cream: "#FFFDF8",
          gold: "#D4AF37",
          darkNavy: "#121533",
          lightTeal: "#EBF7F5",
          lightYellow: "#FEF7E8",
          lightRose: "#FAEAEE",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ['"Jost"', "sans-serif"],
        arabic: ['"Cairo"', "sans-serif"],
        cursive: ['"Great Vibes"', "cursive"],
      },
      letterSpacing: {
        luxury: "0.3em",
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(27, 31, 74, 0.08), 0 4px 6px -2px rgba(27, 31, 74, 0.04)",
        card: "0 4px 20px rgba(0, 0, 0, 0.05)",
        float: "0 20px 40px -15px rgba(212, 42, 82, 0.25)",
      },
      borderRadius: {
        'luxury': "1.25rem",
        'arch': "3rem 3rem 1.25rem 1.25rem",
      },
    },
  },
  plugins: [],
};
