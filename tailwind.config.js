/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./**/*.{html,js,pug}",
      "!./**/node_modules/**/*.{html,js}" // <- Add
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

