/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00E5FF',
        'neon-pink': '#FF007F',
        'dark-bg': '#121212',
        'dark-card': '#1E1E1E',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

