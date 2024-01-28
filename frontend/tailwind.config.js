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
            backgroundColor: '#b4b4b4', // rgba(20,105,69,.7);
          },
          '28%': {
            transform: 'translateY(-7px)',
            backgroundColor: '#3c3c3c', // rgba(20,105,69,.4);
          },
          '44%': {
            transform: 'translateY(0px)',
            backgroundColor: '#787878', // rgba(20,105,69,.2);
          },
        },
        slideeee: {
          '0%': {
            transform: 'translateY(0px)',
          },
          '100%': {
            transform: 'translateY(-40px)',
          },
        },
      },
      animation: {
        slide: 'slide 1.8s ease infinite',
        slideeee:'slideeee 1s ease infinite'
      },
      colors: {
        'BGRegister': '#FFFFFFCC',
        'BGICon': '#f0f2f5',
        "BGMessages": "#6a248a"
      }
    },
  },
  plugins: [],
}