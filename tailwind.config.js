/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* —— MILESTONES·26 设计系统色板 —— */
        obsidian: '#04060F',
        ink: '#090E1D',
        panel: '#0E1628',
        line: 'rgba(255,255,255,0.08)',
        gold: '#F5C452',
        'gold-deep': '#D9A03B',
        amber: '#FF9E3D',
        volt: '#3BFFB2',
        cyanx: '#4DD8FF',
        espana: '#FF4136',
        albiceleste: '#6FC3FF',
        'tx-hi': '#F5F7FF',
        'tx-mid': '#A7AFCB',
        'tx-low': '#6B7492',
        /* —— shadcn 兼容 token —— */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        sans: ['"Noto Sans SC"', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'monospace'],
      },
      letterSpacing: {
        kicker: '0.35em',
        datalabel: '0.18em',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'gold-glow': '0 0 40px rgba(245,196,82,0.25)',
        'volt-glow': '0 0 40px rgba(59,255,178,0.18)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
        'cue-breathe': {
          '0%, 100%': { transform: 'scaleY(0.3)', opacity: '0.4' },
          '50%': { transform: 'scaleY(1)', opacity: '1' },
        },
        'blade-breathe': {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
        'shine-sweep': {
          from: { transform: 'translateX(-120%) skewX(-18deg)' },
          to: { transform: 'translateX(220%) skewX(-18deg)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        marquee: 'marquee 40s linear infinite',
        'marquee-slow': 'marquee 44s linear infinite',
        'marquee-reverse': 'marquee-reverse 44s linear infinite',
        'cue-breathe': 'cue-breathe 1.6s ease-in-out infinite',
        'blade-breathe': 'blade-breathe 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
