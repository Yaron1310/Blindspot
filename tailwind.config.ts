import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d0d12',
        surface: '#16161f',
        card: '#1e1e2e',
        border: '#2a2a3d',
        accent: '#e94560',
        gold: '#f5c842',
        green: '#3ddc97',
        purple: '#a855f7',
        text: '#e8e8f0',
        muted: '#6b6b8a',
      },
      borderRadius: { DEFAULT: '14px' },
      fontFamily: {
        heading: ['var(--font-bebas)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
