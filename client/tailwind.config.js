/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#007d88'
      }
    },
    container: {
      center: true
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  },
  darkMode: 'class'
};
