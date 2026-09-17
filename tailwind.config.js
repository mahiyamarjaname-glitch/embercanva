/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fefcf9',
          100: '#fdf8f0',
          200: '#f9f0e0',
          300: '#f3e4cc',
          400: '#e8d0a8',
          500: '#d9b878',
        },
        blush: {
          50: '#fef5f3',
          100: '#fce8e4',
          200: '#f9d1ca',
          300: '#f2b0a4',
          400: '#e88a7a',
          500: '#d9685a',
          600: '#c14a3c',
        },
        sage: {
          50: '#f5f7f3',
          100: '#e8ede2',
          200: '#cdd8c0',
          300: '#a8bb95',
          400: '#7e9a66',
          500: '#5e7d48',
        },
        charcoal: {
          700: '#3d3a36',
          800: '#2b2926',
          900: '#1a1917',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
