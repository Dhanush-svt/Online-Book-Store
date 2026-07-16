/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#16241F", // deep forest-ink — headers, nav, footer
          light: "#243830",
        },
        paper: "#EEEDE3", // cool paper background (not the cliché warm cream)
        brass: {
          DEFAULT: "#B8863B", // signature accent — brass/gold, evokes book foil lettering
          light: "#D4A65C",
          dark: "#8F6626",
        },
        spine: {
          fiction: "#7A3B3B",
          nonfiction: "#3B5D7A",
          science: "#3B7A5D",
          romance: "#8F3B6E",
          children: "#B8863B",
          other: "#5A5648",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
