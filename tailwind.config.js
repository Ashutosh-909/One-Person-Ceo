/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        term: ['"VT323"', 'monospace'],
      },
      colors: {
        crt: {
          bg: '#0f0f1b',
          panel: '#1b1b2e',
          panel2: '#252540',
          ink: '#e8e6d0',
          gold: '#f5c542',
          green: '#5bd67a',
          red: '#e05a5a',
          blue: '#5aa9e0',
        },
        dept: {
          dev: '#5aa9e0',
          design: '#c46be0',
          marketing: '#f5934b',
          devops: '#5bd67a',
          finance: '#f5c542',
        },
      },
      boxShadow: {
        bevel: 'inset -3px -3px 0 0 rgba(0,0,0,0.45), inset 3px 3px 0 0 rgba(255,255,255,0.18)',
        bevelIn: 'inset 3px 3px 0 0 rgba(0,0,0,0.45), inset -3px -3px 0 0 rgba(255,255,255,0.12)',
      },
      keyframes: {
        blink: { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
        popin: {
          '0%': { transform: 'translateY(8px) scale(0.96)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        bobbing: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        popin: 'popin 220ms ease-out',
        bob: 'bobbing 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
