import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#57564F',
          dark: '#363531',
          foreground: '#a6a295',
        },
        secondary: {
          DEFAULT: '#7A7A73',
          dark: '#3b3b38',
          foreground: '#b5b5ac',
        },
        tertiary: {
          DEFAULT: '#d1cdab',
          dark: '#696758',
          foreground: '#F8F3CE',
        },
      },
    },
  },
} satisfies Config;
