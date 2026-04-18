/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0D1DAD',
          green: '#32B404',
          gray: '#606062',
        },
        primary: '#0D1DAD',
        secondary: '#32B404',
      },
      fontFamily: {
        Onest: ['Onest', 'sans-serif'],
        sans: ['Onest', 'sans-serif'],
      },
      boxShadow: {
        sm: 'none',
        DEFAULT: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
        inner: 'none',
        none: 'none',
      },
      dropShadow: {
        sm: 'none',
        DEFAULT: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
        none: 'none',
      }
    },
  },
  plugins: [],
}
