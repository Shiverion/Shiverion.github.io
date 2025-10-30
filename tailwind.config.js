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
          slideInUp: {
            '0%': { transform: 'translateY(50px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          blink: {
            '50%': { opacity: '0' },
          }
        },
        animation: {
          blob: 'blob 7s infinite',
          'slide-in-up': 'slideInUp 0.5s ease-out forwards',
          blink: 'blink 0.75s step-end infinite',
        },
        // This is new: adds the 'prose' styles for markdown
        typography: ({ theme }) => ({
          DEFAULT: {
            css: {
              '--tw-prose-body': theme('colors.gray[200]'),
              '--tw-prose-headings': theme('colors.white'),
              '--tw-prose-lead': theme('colors.gray[300]'),
              '--tw-prose-links': theme('colors.sky[400]'),
              '--tw-prose-bold': theme('colors.white'),
              '--tw-prose-counters': theme('colors.gray[400]'),
              '--tw-prose-bullets': theme('colors.sky[400]'),
              '--tw-prose-hr': theme('colors.gray[700]'),
              '--tw-prose-quotes': theme('colors.gray[100]'),
              '--tw-prose-quote-borders': theme('colors.gray[700]'),
              '--tw-prose-captions': theme('colors.gray[400]'),
              '--tw-prose-code': theme('colors.white'),
              '--tw-prose-pre-code': theme('colors.gray[200]'),
              '--tw-prose-pre-bg': theme('colors.gray[800]'),
              '--tw-prose-th-borders': theme('colors.gray[600]'),
              '--tw-prose-td-borders': theme('colors.gray[700]'),
              '--tw-prose-invert-body': theme('colors.gray[300]'),
              '--tw-prose-invert-headings': theme('colors.white'),
              '--tw-prose-invert-lead': theme('colors.gray[400]'),
              '--tw-prose-invert-links': theme('colors.sky[400]'),
              '--tw-prose-invert-bold': theme('colors.white'),
              '--tw-prose-invert-counters': theme('colors.gray[400]'),
              '--tw-prose-invert-bullets': theme('colors.sky[400]'),
              '--tw-prose-invert-hr': theme('colors.gray[700]'),
              '--tw-prose-invert-quotes': theme('colors.gray[100]'),
              '--tw-prose-invert-quote-borders': theme('colors.gray[700]'),
              '--tw-prose-invert-captions': theme('colors.gray[400]'),
              '--tw-prose-invert-code': theme('colors.white'),
              '--tw-prose-invert-pre-code': theme('colors.gray[300]'),
              '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
              '--tw-prose-invert-th-borders': theme('colors.gray[700]'),
              '--tw-prose-invert-td-borders': theme('colors.gray[800]'),
            },
          },
        }),
      },
    },
    // This is new: adds the typography plugin
    plugins: [
      require('@tailwindcss/typography'),
    ],
  }
  
  