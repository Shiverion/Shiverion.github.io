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
        keyframes: {
          blob: {
            '0%': { transform: 'translate(0px, 0px) scale(1)' },
            '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
            '100%': { transform: 'translate(0px, 0px) scale(1)' },
          },
          fadeIn: { // <-- This is your animation
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          blink: {
            '50%': { opacity: '0' },
          }
        },
        animation: {
          fadeIn: 'fadeIn 0.5s ease-out', // <-- This is your animation
          blob: 'blob 7s infinite',
          blink: 'blink 0.75s step-end infinite',
        },
        // THIS IS THE NEW PART: Styles for the AI's Markdown response
        typography: ({ theme }) => ({
          DEFAULT: {
            css: {
              '--tw-prose-body': theme('colors.gray[300]'),
              '--tw-prose-headings': theme('colors.white'),
              '--tw-prose-links': theme('colors.sky[400]'),
              '--tw-prose-bold': theme('colors.white'),
              '--tw-prose-bullets': theme('colors.sky[400]'),
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
    // This activates the typography plugin
    plugins: [
      require('@tailwindcss/typography'),
    ],
  }
  