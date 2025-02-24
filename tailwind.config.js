/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx,css}',
  ],
  theme: {
    extend: {
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'rotate(-20deg)' },
          '50%': { transform: 'rotate(20deg)' }
        }
      },
      animation: {
        'wobble': 'wobble 3s ease-in-out infinite',
        'title-shine': 'title-shine 2s linear infinite'
      },
      keyframes: {
        wobble: {
          '0%, 100%': { transform: 'rotate(-20deg)' },
          '50%': { transform: 'rotate(20deg)' }
        },
        'title-shine': {
          '0%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '100%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    },
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
