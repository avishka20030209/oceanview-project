
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        ocean: {
          deep: '#0A2463',
          DEFAULT: '#1E3A8A',
          light: '#3B82F6',
          50: '#eff6ff',
          100: '#dbeafe',
          900: '#1e3a8a',
        },
        sand: {
          DEFAULT: '#F5E6D3',
          dark: '#E5D5C3',
          light: '#FAF4EB',
        },
        coral: {
          DEFAULT: '#FF6B6B',
          hover: '#FA5252',
        }
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
