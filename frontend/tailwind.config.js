/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edf7ed',
          100: '#d1ead1',
          200: '#a3d5a3',
          300: '#75c075',
          400: '#47ab47',
          500: '#2d882d',
          600: '#236c23',
          700: '#1b511b',
          800: '#123712',
          900: '#091d09',
        },
        secondary: {
          50: '#f2f9f0',
          100: '#e3f1dc',
          200: '#c7e3b9',
          300: '#abd697',
          400: '#8fc874',
          500: '#73ba52',
          600: '#5c9a41',
          700: '#457431',
          800: '#2e4d21',
          900: '#172710',
        },
        accent: {
          50: '#f3f9ff',
          100: '#e5f0fe',
          200: '#c5dcfc',
          300: '#a4c7fa',
          400: '#82b3f8',
          500: '#4f92f6',
          600: '#2a71f5',
          700: '#0b50d4',
          800: '#083aa1',
          900: '#04206e',
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        card: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        highlight: '0 0 15px rgba(47, 143, 47, 0.4)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'fadeIn': 'fadeIn 0.5s ease-in',
        'slideUp': 'slideUp 0.5s ease-out',
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
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'leaf-pattern': "url('/patterns/leaf-pattern.svg')",
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
} 