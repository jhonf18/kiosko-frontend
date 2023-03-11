const FONTS = [
  'Monserrat',
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
  'Noto Color Emoji'
];

module.exports = {
  mode: 'jit',
  purge: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xs: '380px'
      },
      colors: {
        light: {
          font: '#495057',
          'font-title': '#424445',
          background: '#fafbff'
        },
        purple: {
          400: '#53547a',
          500: '#46475f',
          600: '#3c3d58',
          700: '#313355',
          800: '#2c2f55',
          900: '#282b53'
        },
        red: {
          500: '#db5353',
          600: '#dd3333'
        },
        primary: {
          light: '#F4BE68',
          DEFAULT: '#FF9431',
          dark: '#D77D2A'
        }
      },
      fontFamily: {
        sans: FONTS,
        serif: FONTS,
        mono: FONTS,
        display: FONTS,
        body: FONTS
      },
      maxHeight: {
        '1rem': 'calc(100vh - 1rem)',
        '3rem': 'calc(100vh - 3rem)'
      },
      maxWidth: {
        6: '6rem',
        17: '17rem',
        14: '14rem'
      },
      width: {
        'full-1rem': 'calc(100% - 1rem)',
        17: '70px',
        15: '60px',
        13: '50px'
      },
      height: {
        'screen-menu-desktop': 'calc(100vh - 130px)',
        'screen-menu-mobile': 'calc(100vh - 66px)',
        15: '60px',
        13: '50px'
      },
      saturate: {
        65: '.65',
        85: '.85'
      }
    },
    screens: {
      sm: '576px',
      'sm-md': '665px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  },
  variants: {
    extend: {}
    // scrollbar: ['rounded', 'dark']
  }
  // plugins: [
  //   require('@tailwindcss/line-clamp'),
  //   require('tailwind-scrollbar')
  // ],
};
