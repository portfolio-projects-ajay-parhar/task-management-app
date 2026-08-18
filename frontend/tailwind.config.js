/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["variant", ["&:is(.dark *)", "&.dark"]],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
