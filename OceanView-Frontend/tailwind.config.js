/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        tropical: {
          deep: '#0D9488',      // deep teal green
          DEFAULT: '#14B8A6',   // main teal
          light: '#5EEAD4',     // light aqua/teal
          50: '#ECFEFF',        // very light aqua
          100: '#CCFBF1',       // soft aqua
          900: '#0F766E',       // darker accent
        },
        palm: {
          DEFAULT: '#A3F7BF',   // soft tropical green
          dark: '#6EE7B7',
          light: '#D1FAE5',
        },
        sun: {
          DEFAULT: '#FFD166',   // warm yellow accent
          hover: '#FACC15',
        },
        coral: {
          DEFAULT: '#FF6B6B',   // keep coral for highlights
          hover: '#FA5252',
        },
      },
      fontFamily: {
        serif: ['"Tenor Sans"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
