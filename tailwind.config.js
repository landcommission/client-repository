/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '0.75rem' }],
      }
    },
  },
  plugins: [],
}

