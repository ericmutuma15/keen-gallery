/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        ivory: '#f5f1ea',
        stone: '#d6d0c7',
        accent: '#b27a4c',
        sable: '#231f1b',
      },
      boxShadow: {
        soft: '0 25px 50px -12px rgba(17,17,17,0.22)',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
