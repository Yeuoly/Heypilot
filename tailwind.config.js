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
      },
      colors: {
        background: '#1e1e2f',
        backgroundSecondary: '#2b2b3d',
        primary: '#4a90e2', 
        secondary: '#357ABD',
        accent: '#f5a623',
        textPrimary: '#e0e0e0',
        textSecondary: '#b0b0b0',
        border: '#3c3c4d',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      borderRadius: {
        'lg': '0.5rem',
      },
      boxShadow: {
        'lg': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}

