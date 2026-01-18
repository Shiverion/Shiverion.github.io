/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        // Refined color palette - single accent for cleaner look
        neon: {
          blue: '#3b82f6', // Primary accent - vibrant blue
          cyan: '#3b82f6', // Unified to single accent
          purple: '#3b82f6', // Unified to single accent (was purple, now blue for consistency)
          magenta: '#3b82f6', // Unified to single accent
          pink: '#ef4444', // Red for errors/alerts only
          green: '#22c55e', // Green for success states
        },
        cyber: {
          dark: '#0a0a0b', // Deeper background
          darker: '#050505', // Near black
          panel: '#141414', // Warmer dark gray for cards
        },
        // Text colors
        text: {
          primary: '#e4e4e7', // Brighter for readability
          muted: '#71717a', // Muted gray
        }
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' }, // Subtle float
        },
        // Keep other keyframes empty or minimal to avoid errors if referenced
        blob: { '0%, 100%': { transform: 'scale(1)' } },
        blink: { '50%': { opacity: '0.5' } },
        glow: { '0%, 100%': { opacity: '1' } },
        neonPulse: { '0%, 100%': { opacity: '1' } },
        scanline: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
        shimmer: { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
        borderGlow: { '0%, 100%': { borderColor: '#30363d' } },
        holographic: { '0%, 100%': { backgroundPosition: '0% 50%' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        float: 'float 3s ease-in-out infinite',
        // Mapped to minimal animations
        blob: 'none',
        blink: 'none',
        glow: 'none',
        neonPulse: 'none',
        scanline: 'none',
        shimmer: 'none',
        borderGlow: 'none',
        holographic: 'none',
      },
      boxShadow: {
        'neon-blue': '0 0 0 1px #30363d',
        'neon-cyan': '0 0 0 1px #30363d',
        'neon-purple': '0 0 0 1px #30363d',
        'neon-magenta': '0 0 0 1px #30363d',
        'neon-pink': '0 0 0 1px #30363d',
        'glass': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'glass-strong': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'holographic': 'none',
        'cyber-gradient': 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.gray[300]'),
            '--tw-prose-headings': theme('colors.neon.cyan'),
            '--tw-prose-links': theme('colors.neon.blue'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-bullets': theme('colors.neon.cyan'),
            p: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            ul: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
