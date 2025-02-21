import type { Config } from 'tailwindcss';
import fluid, { extract, screens, fontSize } from 'fluid-tailwind';

const config: Config = {
  content: {
    files: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    extract,
  },
  darkMode: ['class', '[data-mode="dark"]'],
  theme: {
    screens,
    fontSize,
    extend: {
      screens: {
        xsm: '8rem',
        xs: '20rem',
      },
      fontFamily: {
        sans: ['Inter Variable', 'sans-serif'],
      },
    },
  },
  plugins: [fluid],
};
export default config;
