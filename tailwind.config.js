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
          // Cyber neon color palette
          neon: {
            blue: '#00d9ff',
            cyan: '#00ffff',
            purple: '#b537ff',
            magenta: '#ff00ff',
            pink: '#ff0080',
            green: '#00ff88',
          },
          cyber: {
            dark: '#0a0e27',
            darker: '#050816',
            panel: 'rgba(15, 23, 42, 0.8)',
          }
        },
        keyframes: {
          blob: {
            '0%': { transform: 'translate(0px, 0px) scale(1)' },
            '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
            '100%': { transform: 'translate(0px, 0px) scale(1)' },
          },
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          blink: {
            '50%': { opacity: '0' },
          },
          glow: {
            '0%, 100%': {
              boxShadow: '0 0 15px rgba(0, 217, 255, 0.3), 0 0 30px rgba(0, 217, 255, 0.15)',
            },
            '50%': {
              boxShadow: '0 0 20px rgba(0, 217, 255, 0.4), 0 0 40px rgba(0, 217, 255, 0.2)',
            },
          },
          neonPulse: {
            '0%, 100%': {
              textShadow: '0 0 8px rgba(0, 217, 255, 0.4), 0 0 15px rgba(0, 217, 255, 0.2)',
            },
            '50%': {
              textShadow: '0 0 12px rgba(0, 217, 255, 0.5), 0 0 20px rgba(0, 217, 255, 0.3)',
            },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' },
          },
          scanline: {
            '0%': { transform: 'translateY(-100%)' },
            '100%': { transform: 'translateY(100%)' },
          },
          shimmer: {
            '0%': { backgroundPosition: '-1000px 0' },
            '100%': { backgroundPosition: '1000px 0' },
          },
          borderGlow: {
            '0%, 100%': {
              borderColor: 'rgba(0, 217, 255, 0.5)',
            },
            '50%': {
              borderColor: 'rgba(0, 217, 255, 1)',
            },
          },
          holographic: {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
        },
        animation: {
          fadeIn: 'fadeIn 0.5s ease-out',
          blob: 'blob 7s infinite',
          blink: 'blink 0.75s step-end infinite',
          glow: 'glow 2s ease-in-out infinite',
          neonPulse: 'neonPulse 2s ease-in-out infinite',
          float: 'float 3s ease-in-out infinite',
          scanline: 'scanline 8s linear infinite',
          shimmer: 'shimmer 3s linear infinite',
          borderGlow: 'borderGlow 2s ease-in-out infinite',
          holographic: 'holographic 5s ease infinite',
        },
        boxShadow: {
          'neon-blue': '0 0 5px rgba(0, 217, 255, 0.15), 0 0 10px rgba(0, 217, 255, 0.08)',
          'neon-cyan': '0 0 5px rgba(0, 255, 255, 0.15), 0 0 10px rgba(0, 255, 255, 0.08)',
          'neon-purple': '0 0 5px rgba(181, 55, 255, 0.15), 0 0 10px rgba(181, 55, 255, 0.08)',
          'neon-magenta': '0 0 5px rgba(255, 0, 255, 0.15), 0 0 10px rgba(255, 0, 255, 0.08)',
          'neon-pink': '0 0 5px rgba(255, 0, 128, 0.15), 0 0 10px rgba(255, 0, 128, 0.08)',
          'glass': '0 8px 12px 0 rgba(0, 217, 255, 0.08)',
          'glass-strong': '0 8px 32px 0 rgba(0, 217, 255, 0.12)',
        },
        backdropBlur: {
          xs: '2px',
        },
        backgroundImage: {
          'holographic': 'linear-gradient(45deg, #00d9ff, #b537ff, #00ffff, #ff00ff)',
          'cyber-gradient': 'linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(181, 55, 255, 0.1) 100%)',
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
  