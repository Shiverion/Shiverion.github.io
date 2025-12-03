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
        // GitHub Dark theme mapping for existing "neon" classes
        neon: {
          blue: '#58a6ff', // GitHub Blue
          cyan: '#58a6ff', // GitHub Blue (mapped)
          purple: '#bc8cff', // GitHub Purple
          magenta: '#bc8cff', // GitHub Purple (mapped)
          pink: '#ff7b72', // GitHub Red
          green: '#238636', // GitHub Green
        },
        cyber: {
          dark: '#0d1117', // GitHub BG
          darker: '#010409', // GitHub Darker BG
          panel: '#161b22', // GitHub Card BG
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
