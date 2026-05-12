/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Ivory Atelier palette
        ivory: {
          50: '#FBF7EE',
          100: '#F5EFE2',
          200: '#EFE7D4',
          300: '#E5DBC3',
          400: '#C9BCA2',
          500: '#9F9379',
        },
        ink: {
          DEFAULT: '#1A1813',
          900: '#1A1813',
          800: '#26221B',
          700: '#3A3528',
          600: '#5A523F',
          500: '#7A7158',
          400: '#9C9276',
          300: '#BFB59A',
        },
        forest: {
          DEFAULT: '#2B3F2E',
          deep: '#1F2E22',
          mid: '#324E36',
          soft: '#4C6951',
          tint: '#D9E0D6',
        },
        bronze: {
          DEFAULT: '#C28A3F',
          deep: '#9A6520',
          warm: '#D49E54',
          tint: '#EFD8B5',
        },
        // Tailwind utility tokens (preserve shadcn semantics if used)
        background: '#F5EFE2',
        foreground: '#1A1813',
        border: 'rgba(26, 24, 19, 0.14)',
        input: 'rgba(26, 24, 19, 0.14)',
        ring: '#2B3F2E',
      },
      letterSpacing: {
        editorial: '0.22em',
        wide2: '0.32em',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        marquee: 'marquee 48s linear infinite',
        'fade-up': 'fade-up 0.8s ease-out both',
        'fade-in': 'fade-in 0.8s ease-out both',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
