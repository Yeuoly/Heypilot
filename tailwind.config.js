/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.vue",
    "./src/**/*.js",
  ],
  theme: {
    extend: {
      animation: {
        'spin': 'spin 1s linear infinite'
      }
    },
  },
  plugins: [],
}

