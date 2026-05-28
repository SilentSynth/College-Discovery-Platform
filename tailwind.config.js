/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f8fafc',
          100: '#eef2ff',
          200: '#dbe4ff',
          300: '#b8c7ff',
          400: '#8799ff',
          500: '#5b72f2',
          600: '#4251d9',
          700: '#3240ad',
          800: '#252f7a',
          900: '#171e52',
        },
      },
      boxShadow: {
        soft: '0 20px 50px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};