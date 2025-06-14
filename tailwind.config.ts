
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['EB Garamond', 'serif'],
        headline: ['Rajdhani', 'sans-serif'],
        code: ['monospace', 'monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
         'subtle-glow': { 
          '0%, 100%': { filter: 'drop-shadow(0 0 5px hsl(var(--accent)/0.3))' },
          '50%': { filter: 'drop-shadow(0 0 10px hsl(var(--accent)/0.5))' },
        },
        'title-pulse': {
          '0%, 100%': { textShadow: '0 0 2px hsl(var(--accent)), 0 0 3px hsl(var(--accent) / 0.8), 0 0 4px hsl(var(--accent) / 0.6)' },
          '50%': { textShadow: '0 0 3px hsl(var(--accent)), 0 0 5px hsl(var(--accent) / 0.8), 0 0 7px hsl(var(--accent) / 0.6)' },
        },
        'star-shimmer': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.7' },
        },
        'orbital-glow': {
          '0%': { boxShadow: 'inset 0 0 4px 0px hsl(var(--accent) / 0.25), 3px 0px 12px 0px hsl(var(--accent) / 0.5), -3px 0px 7px 0px hsl(var(--accent) / 0.25)' },
          '25%': { boxShadow: 'inset 0 0 4px 0px hsl(var(--accent) / 0.25), 0px 3px 12px 0px hsl(var(--accent) / 0.5), 0px -3px 7px 0px hsl(var(--accent) / 0.25)' },
          '50%': { boxShadow: 'inset 0 0 4px 0px hsl(var(--accent) / 0.25), -3px 0px 12px 0px hsl(var(--accent) / 0.5), 3px 0px 7px 0px hsl(var(--accent) / 0.25)' },
          '75%': { boxShadow: 'inset 0 0 4px 0px hsl(var(--accent) / 0.25), 0px -3px 12px 0px hsl(var(--accent) / 0.5), 0px 3px 7px 0px hsl(var(--accent) / 0.25)' },
          '100%': { boxShadow: 'inset 0 0 4px 0px hsl(var(--accent) / 0.25), 3px 0px 12px 0px hsl(var(--accent) / 0.5), -3px 0px 7px 0px hsl(var(--accent) / 0.25)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'subtle-glow': 'subtle-glow 3s ease-in-out infinite alternate',
        'title-pulse': 'title-pulse 2.5s ease-in-out infinite alternate',
        'star-shimmer': 'star-shimmer 10s ease-in-out infinite alternate',
        'orbital-glow': 'orbital-glow 3s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
