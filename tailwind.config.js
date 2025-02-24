/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx,css}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

// export default {
//   content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"], // Add all file types that use Tailwind classes
//   darkMode: 'class',
//   theme: {
//     extend: {
//       transitionProperty: {
//         'transform': 'transform',
//       },
//       rotate: {
//         'x-180': 'rotateX(180deg)',
//       },
//     },
//   },
//   plugins: [],
// }
