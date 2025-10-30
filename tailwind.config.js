/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Scans your App.jsx for styles
    ],
    theme: {
      extend: {
        fontFamily: {
          // Use 'Inter' as the primary font
          sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        },
        // Custom animations
        keyframes: {
          // This is the new animation
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          blob: {
            '0%': { transform: 'translate(0px, 0px) scale(1)' },
            '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
            '100%': { transform: 'translate(0px, 0px) scale(1)' },
          },
          slideInUp: {
            '0%': { transform: 'translateY(50px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          blink: {
            '50%': { opacity: '0' },
          }
        },
        animation: {
          // This is the new animation
          fadeIn: 'fadeIn 0.5s ease-out',
          blob: 'blob 7s infinite',
          'slide-in-up': 'slideInUp 0.5s ease-out forwards',
          blink: 'blink 0.75s step-end infinite',
        }
      },
    },
    plugins: [
      require('@tailwindcss/typography'), // Added for markdown styling
    ],
  }

