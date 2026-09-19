/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          // Warm Terracotta & Cognac (Primary Accent from mockup)
          terracotta: "#9E532B",
          terracottaHover: "#85401B",
          cognac: "#B86B35",

          // Warm Sand & Beige (Cards & Containers from mockup)
          sand: "#F5EFE6",
          sandLight: "#FAF7F2",
          sandDark: "#EDE6DB",

          // Deep Charcoal & Warm Espresso (Typography & Dark Elements from mockup)
          charcoal: "#1F1E1D",
          taupe: "#7D7973",

          // Soft Amber Gold (Rating Stars & Badges from mockup)
          amberGold: "#D4A373",

          // Backward-compatible Brand Aliases for all existing pages
          rose: "#9E532B",
          crimson: "#9E532B",
          navy: "#1F1E1D",
          darkNavy: "#141312",
          cream: "#FAF7F2",
          yellow: "#D4A373",
          gold: "#D4A373",
          teal: "#5A7365",
          lightTeal: "#F0F5F2",
          lightYellow: "#FBF3E8",
          lightRose: "#F8EFE4",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ['"Plus Jakarta Sans"', '"Jost"', "sans-serif"],
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
