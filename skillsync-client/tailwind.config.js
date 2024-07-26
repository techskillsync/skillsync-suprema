/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-linear":
          "linear-gradient(var(--tw-gradient-angle), var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
      }),
      backgroundClip: {
        text: "text",
      },
    },
  },
  variants: {
    extend: {
      backgroundImage: ["hover", "focus"],
      backgroundClip: ["hover", "focus"],
    },
  },
  plugins: [
    require('flowbite/plugin')({
        charts: true,
    }),
  ],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
};
