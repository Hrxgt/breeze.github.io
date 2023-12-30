/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-animations'),
    require('tailwind-scrollbar'),
  ],
};

