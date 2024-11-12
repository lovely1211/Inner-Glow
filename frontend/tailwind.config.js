/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      boxShadow: {
        white: '0 4px 6px rgba(255, 255, 255, 0.6)', 
      },
    },
  },
  plugins: [],
}

