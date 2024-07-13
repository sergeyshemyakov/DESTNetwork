import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: "#0F1A20",
            primary: {
              DEFAULT: "#20C997",
              foreground: "#0F1A20",
            },
            content1: {
              DEFAULT: "#1B252B",
              foreground: "#ffffff",
            },
            gray: {
              50: "#f8f8f8",
              100: "#eaeaeb",
              200: "#d7d8da",
              300: "#b8babd",
              400: "#a7abad",
              500: "#979c9f",
              600: "#62676a",
              700: "#535759",
              800: "#44484a",
              900: "#2c2d2f",
            },
            focus: "#1aa179",
          },
        },
        light: {
          foreground: "#0F1A20",
          colors: {
            gray: {
              50: "#f8f8f8",
              100: "#eaeaeb",
              200: "#d7d8da",
              300: "#b8babd",
              400: "#a7abad",
              500: "#979c9f",
              600: "#62676a",
              700: "#535759",
              800: "#44484a",
              900: "#2c2d2f",
            },
            primary: {
              DEFAULT: "#20C997",
              foreground: "#ffffff",
            },
            focus: "#26f1b5",
          },
        },
      },
    }),
  ],
};
