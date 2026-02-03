/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0EA5E9',   // Sky Blue
        secondary: '#64748B', // Slate
        accent: '#10B981',    // Emerald
        background: '#F8FAFC',// Slate 50
        surface: '#FFFFFF',   // White
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
