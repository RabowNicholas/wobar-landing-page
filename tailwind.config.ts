import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#0a0a0a',
        'off-black': '#111111',
        charcoal: '#1a1a1a',
        purple: {
          DEFAULT: '#7b2fff',
          dim: 'rgba(123, 47, 255, 0.3)',
          glow: 'rgba(123, 47, 255, 0.15)',
        },
        white: '#f0f0f0',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Courier New', 'monospace'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        site: '1200px',
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        'spin-slow-reverse': 'spin 12s linear infinite reverse',
      },
      keyframes: {
        'logo-outer': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'logo-inner': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
