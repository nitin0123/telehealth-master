/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FCFAFF',
        sand: '#EADCF8',
        clay: '#9333EA',
        claydk: '#7E22CE',
        peach: '#EBD9FB',
        ever: '#6D28D9',
        everdk: '#4C1D95',
        sage: '#C4B5FD',
        moss: '#7C5BBE',
        ink: '#2E2440',
        stone: '#6B6280',
      },
      fontFamily: {
        // `font-serif` (used on headings) now points at Geist so the whole site
        // uses one consistent typeface. Set this to a serif family to switch
        // headings back to a serif look.
        serif: ['Geist Variable', 'Geist', 'Inter', 'system-ui', 'sans-serif'],
        // `font-sans` = body & UI, matching Ideogram exactly with Geist
        sans: ['Geist Variable', 'Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
    },
  },
  plugins: [],
};
