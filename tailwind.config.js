/** @type {import('tailwindcss').Config} */
export default {
  // Make sure this line is here, spelled correctly, and inside the main object
  darkMode: 'class',

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}