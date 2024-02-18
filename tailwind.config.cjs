/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: "off",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "dark", "cupcake", "winter", "lemonade"],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
