/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

const FONTS = [
  'Montserrat',
  'ui-sans-serif',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Helvetica Neue',
  'Arial',
  'Noto Sans',
  'sans-serif',
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Segoe UI Symbol',
  'Noto Color Emoji',
]

module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    colors: {
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      green: colors.green,
      red: colors.red,
      yellow: colors.yellow,
    },
    extend: {
      colors: {
        primary: {
          light: '#F4BE68',
          DEFAULT: '#FF9431',
          dark: '#D77D2A',
        },
      },
      fontFamily: {
        sans: FONTS,
        serif: FONTS,
        mono: FONTS,
        display: FONTS,
        body: FONTS,
      },
      width: {
        68: '17rem',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
