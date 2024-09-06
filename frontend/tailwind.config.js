/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          100: "#E6E6FA",
          200: "#D8BFD8",
          300: "#DDA0DD",
          400: "#DA70D6",
          500: "#EE82EE",
          600: "#D8BFD8",
          700: "#BA55D3",
          800: "#9932CC",
          900: "#8A2BE2",
        },
        lightblue: {
          DEFAULT: "#E0F7FA",   // Very Light Blue
        },
      }
    },
  },
  plugins: [],
}

