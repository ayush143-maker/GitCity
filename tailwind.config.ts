import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#05070a',
          dark: '#0a0e13',
          grey: '#1a1f26',
          cyan: '#00e5ff',
          blue: '#4aa3ff',
          white: '#e0f4ff',
        },
      },
    },
  },
  plugins: [],
};

export default config;
