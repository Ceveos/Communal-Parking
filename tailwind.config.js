const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          ...colors.slate,
          dark: {
            ...colors.neutral,
          },
        },
        accent: {
          ...colors.blue,
          dark: {
            ...colors.blue
          }
        },

        /* Theme colors */
        th: {
          background: {
            DEFAULT: colors.gray[100],
            dark: colors.neutral[900]
          },

          foreground: {
            DEFAULT: colors.white,
            dark: colors.neutral[800],
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
