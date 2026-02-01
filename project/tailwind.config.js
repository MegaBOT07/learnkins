/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary colors from LearnKins logo
        'learnkins': {
          'blue': {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#4f7cff', // Main blue from logo
            600: '#4338ca',
            700: '#3730a3',
            800: '#312e81',
            900: '#1e1b4b',
          },
          'purple': {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7', // Main purple from logo
            600: '#9333ea',
            700: '#7c3aed',
            800: '#6b21a8',
            900: '#581c87',
          },
          'orange': {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#ff8c42', // Main orange from logo
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
          },
          'green': {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e', // Main green from logo
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
        }
      },
      backgroundImage: {
        'learnkins-gradient': 'linear-gradient(135deg, #4f7cff 0%, #a855f7 50%, #ff8c42 100%)',
        'learnkins-gradient-reverse': 'linear-gradient(135deg, #ff8c42 0%, #a855f7 50%, #4f7cff 100%)',
        'learnkins-subtle': 'linear-gradient(135deg, #eff6ff 0%, #faf5ff 100%)',
        'radial-gradient': 'radial-gradient(circle at center, rgba(79, 124, 255, 0.1) 0%, transparent 70%)',
      }
    },
  },
  plugins: [],
};