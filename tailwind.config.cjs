/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      gridTemplateColumns: {
        post: 'repeat(2, minmax(0, 1fr));',
      },
    },
    container: {
      center: true,
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      heading: ['Space Grotesk', 'sans-serif'],
    },
  },
  plugins: [],
}
