import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'racing-black': '#0a0a0a',
        'racing-dark': '#111111',
        'racing-gray': '#1a1a1a',
        'racing-light': '#2a2a2a',
        'neon-cyan': '#00f0ff',
        'neon-orange': '#ff6b00',
        'neon-cyan-dim': '#00a0aa',
        'neon-orange-dim': '#cc5500',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      backgroundImage: {
        'racing-stripe': `repeating-linear-gradient(
          45deg,
          #0a0a0a,
          #0a0a0a 10px,
          #111111 10px,
          #111111 20px
        )`,
      },
    },
  },
  plugins: [],
} satisfies Config;
