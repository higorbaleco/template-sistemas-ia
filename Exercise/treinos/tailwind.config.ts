import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary: vibrant purple/indigo
        primary: {
          50: '#f8f7ff',
          100: '#f0edff',
          200: '#e6dcff',
          300: '#d4c5ff',
          400: '#b8a4ff',
          500: '#9b7ff5', // base
          600: '#7c5ce7', // main CTA color
          700: '#6c5ce7', // darker accent
          800: '#5b4cdb',
          900: '#4a3bcc',
        },
        // Secondary: violet
        secondary: {
          50: '#faf8ff',
          100: '#f3eeff',
          200: '#e8dcff',
          300: '#d9c5ff',
          400: '#c5a8ff',
          500: '#b08eff',
          600: '#9966ff', // gradient secondary
          700: '#8855ff',
          800: '#6f3fff',
          900: '#5a1aff',
        },
        // Semantic colors
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        // Neutral scales for light/dark modes
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xs: '0.25rem',
        sm: '0.375rem',
        base: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        elevated: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        gradient: '0 6px 20px -2px rgba(124, 92, 231, 0.2)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7c5ce7 0%, #9966ff 100%)',
        'gradient-card': 'linear-gradient(135deg, #6c5ce7 0%, #8855ff 50%, #a88fef 100%)',
      },
      spacing: {
        'safe-top': 'max(1rem, env(safe-area-inset-top))',
        'safe-bottom': 'max(1rem, env(safe-area-inset-bottom))',
        'safe-left': 'max(1rem, env(safe-area-inset-left))',
        'safe-right': 'max(1rem, env(safe-area-inset-right))',
      },
    },
  },
  plugins: [
    // Custom component plugins
    function({ addComponents, theme }: any) {
      const components = {
        '.card': {
          '@apply rounded-2xl p-4 transition-all duration-200': {},
          '@apply bg-white dark:bg-slate-900 shadow-card': {},
        },
        '.card-elevated': {
          '@apply rounded-2xl p-4 transition-all duration-200': {},
          '@apply bg-white dark:bg-slate-800 shadow-elevated': {},
        },
        '.card-gradient': {
          '@apply rounded-2xl p-4 transition-all duration-200': {},
          '@apply bg-gradient-card text-white shadow-gradient': {},
        },
        '.stat-pill': {
          '@apply inline-flex items-center gap-2 rounded-full px-3 py-1.5': {},
          '@apply bg-primary-100 text-primary-900 dark:bg-primary-900 dark:text-primary-100': {},
          '@apply text-sm font-semibold': {},
        },
        '.badge-difficulty': {
          '@apply inline-flex items-center rounded-full px-2 py-1': {},
          '@apply text-xs font-semibold': {},
        },
        '.badge-iniciante': {
          '@apply badge-difficulty bg-success/20 text-success dark:bg-success/30': {},
        },
        '.badge-intermediario': {
          '@apply badge-difficulty bg-warning/20 text-warning dark:bg-warning/30': {},
        },
        '.badge-avancado': {
          '@apply badge-difficulty bg-danger/20 text-danger dark:bg-danger/30': {},
        },
        '.btn-primary': {
          '@apply inline-flex items-center justify-center rounded-lg px-4 py-2.5': {},
          '@apply bg-primary-600 hover:bg-primary-700 text-white font-semibold': {},
          '@apply active:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed': {},
          '@apply transition-colors duration-200': {},
        },
        '.btn-secondary': {
          '@apply inline-flex items-center justify-center rounded-lg px-4 py-2.5': {},
          '@apply bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700': {},
          '@apply text-neutral-900 dark:text-neutral-100 font-semibold': {},
          '@apply transition-colors duration-200': {},
        },
        '.btn-ghost': {
          '@apply inline-flex items-center justify-center rounded-lg px-4 py-2.5': {},
          '@apply hover:bg-neutral-100 dark:hover:bg-neutral-800': {},
          '@apply text-neutral-900 dark:text-neutral-100 font-semibold': {},
          '@apply transition-colors duration-200': {},
        },
      }
      addComponents(components)
    },
  ],
} satisfies Config
