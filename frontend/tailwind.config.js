/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        heading: ['Syne', 'sans-serif'],
      },
      colors: {
        alphonse: {
          charcoal: '#282E31', // Dark Mode BG
          cream: '#E5E1D4',    // Light Mode BG
          yellow: '#E1A424',
          blue: '#5252C5',
          red: '#CA465D',
          surface: '#1f2426', // Slightly darker than charcoal for contrast
        }
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-light': '4px 4px 0px 0px #E5E1D4', // Cream shadow for dark mode
      }
    },
  },
  plugins: [],
}