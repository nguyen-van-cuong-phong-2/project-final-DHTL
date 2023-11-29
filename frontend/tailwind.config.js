//  @type {import('tailwindcss').Config} 
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slide: {
          '0%': {
            transform: 'translateY(0px)',
            backgroundColor: '#6CAD96', // rgba(20,105,69,.7);
          },
          '28%': {
            transform: 'translateY(-7px)',
            backgroundColor: '#9ECAB9', // rgba(20,105,69,.4);
          },
          '44%': {
            transform: 'translateY(0px)',
            backgroundColor: '#B5D9CB', // rgba(20,105,69,.2);
          },
        },
      },
      animation: {
        slide: 'slide 1.8s ease infinite',
      },
      colors: {
        'BGRegister': '#FFFFFFCC',
        'BGICon': '#e4e6eb',
        "BGMessages": "#6a248a"
      }
    },
  },
  plugins: [],
}