/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{html,js,jsx,ts,tsx}"],
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
  plugins: [],
};
