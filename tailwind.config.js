/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0D1DAD',
          green: '#0D1DAD',
          gray: '#606062',
        },
        primary: '#0D1DAD',
        secondary: '#0D1DAD',
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
