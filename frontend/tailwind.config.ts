import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        wave: {
          "0%": {
            transform: "translateY(0px)",
            backgroundColor: "#6CAD96", // rgba(20,105,69,.7);
          },
          "28%": {
            transform: "translateY(-7px)",
            backgroundColor: "#9ECAB9", // rgba(20,105,69,.4);
          },
          "44%": {
            transform: "translateY(0px)",
            backgroundColor: "#B5D9CB", // rgba(20,105,69,.2);
          },
        },
      },
      animation: {
        "waving": "wave 1.8s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
