/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FBC500',
          dark: '#e5aa00',
        },
        background: {
          DEFAULT: '#060D17',
          light: '#30343F',
        },
        text: {
          DEFAULT: '#F6F6F7',
          secondary: '#C6C8CD',
        }
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}