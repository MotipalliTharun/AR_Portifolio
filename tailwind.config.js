/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ar-primary': '#6366f1',
        'ar-secondary': '#8b5cf6',
        'ar-accent': '#ec4899',
      },
    },
  },
  plugins: [],
}

