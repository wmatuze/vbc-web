export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        serif: ["Merriweather", "serif"],
        display: ["Playfair Display", "serif"],
      },
      colors: {
        primary: {
          50: "#e6f0ff",
          100: "#cce0ff",
          200: "#99c2ff",
          300: "#66a3ff",
          400: "#3385ff",
          500: "#0056b3", // base
          600: "#0044a3",
          700: "#003380",
          800: "#00225c",
          900: "#001133",
        },
        secondary: {
          50: "#fff8e6",
          100: "#ffefcc",
          200: "#ffe099",
          300: "#ffd066",
          400: "#ffc133",
          500: "#ffbe0b", // base
          600: "#e6ab00",
          700: "#b38600",
          800: "#806100",
          900: "#4d3a00",
        },
        accent: {
          50: "#fff4e6",
          100: "#ffe8cc",
          200: "#ffd199",
          300: "#ffba66",
          400: "#ffa333",
          500: "#f59e0b", // base
          600: "#cc7a00",
          700: "#995c00",
          800: "#663d00",
          900: "#331f00",
        },
      },
      boxShadow: {
        card: "0 4px 6px rgba(0, 0, 0, 0.1)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "inner-glow": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        "soft-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      lineClamp: {
        2: "2",
        3: "3",
        4: "4",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
