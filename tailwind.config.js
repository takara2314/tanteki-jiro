/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['arial', 'sans-serif'],
        'logo': ['Mochiy Pop One', 'arial', 'sans-serif']
      }
    }
  },
  plugins: []
};
