/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      transitionProperty: {
        'transform': 'transform',
      },
      rotate: {
        'x-180': 'rotateX(180deg)',
      },
    },
  },
  plugins: [],
}
