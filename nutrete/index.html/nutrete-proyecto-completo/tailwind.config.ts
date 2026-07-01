import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── BRAND COLORS ──────────────────────────────────────────────
      colors: {
        brand: {
          50:  '#f0fdf5',
          100: '#dcfce8',
          200: '#bbf7d1',
          300: '#86efad',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50:  '#fdf8f0',
          100: '#faebd7',
          200: '#f4d5a8',
          300: '#ecb96e',
          400: '#e4993a',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        accent: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Semantic
        success: '#22c55e',
        warning: '#f59e0b',
        danger:  '#ef4444',
        info:    '#3b82f6',
      },

      // ── TYPOGRAPHY ────────────────────────────────────────────────
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        '10xl': ['10rem', { lineHeight: '1' }],
      },

      // ── SPACING ───────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },

      // ── BORDER RADIUS ─────────────────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // ── SHADOWS ───────────────────────────────────────────────────
      boxShadow: {
        'glow-green':  '0 0 40px rgba(34, 197, 94, 0.35)',
        'glow-orange': '0 0 40px rgba(249, 115, 22, 0.35)',
        'card-hover':  '0 20px 60px -15px rgba(0,0,0,0.25)',
        'premium':     '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
      },

      // ── ANIMATIONS ────────────────────────────────────────────────
      animation: {
        'fade-in':        'fadeIn 0.5s ease-out forwards',
        'fade-up':        'fadeUp 0.6s ease-out forwards',
        'fade-up-slow':   'fadeUp 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'pulse-slow':     'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle':  'bounceSubtle 2s infinite',
        'counter':        'counter 2s ease-out forwards',
        'shimmer':        'shimmer 2s infinite',
        'float':          'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-15px)' },
        },
      },

      // ── BACKGROUNDS ───────────────────────────────────────────────
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-green':       'radial-gradient(at 40% 20%, hsla(120,60%,40%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(30,60%,50%,0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(150,50%,35%,0.1) 0px, transparent 50%)',
        'shimmer':          'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
      },

      // ── SCREENS ───────────────────────────────────────────────────
      screens: {
        'xs': '480px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}

export default config
