/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'carbot-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'apple-reveal-up': 'appleRevealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'apple-reveal-scale': 'appleRevealScale 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'magnetic-hover': 'magneticHover 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'depth-hover': 'depthHover 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'particle-float': 'particleFloat 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        appleRevealUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(60px) scale(0.95)',
            filter: 'blur(8px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
            filter: 'blur(0px)',
          },
        },
        appleRevealScale: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
            filter: 'blur(4px)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
            filter: 'blur(0px)',
          },
        },
        magneticHover: {
          '0%': {
            transform: 'scale(1) translateY(0)',
          },
          '100%': {
            transform: 'scale(1.02) translateY(-2px)',
          },
        },
        depthHover: {
          '0%': {
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) translateZ(0)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
          '100%': {
            transform: 'perspective(1000px) rotateX(2deg) rotateY(2deg) translateY(-12px) translateZ(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          },
        },
        particleFloat: {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-10px) rotate(180deg)',
          },
        },
        gradientShift: {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'apple-depth': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'apple-glow': '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(168, 85, 247, 0.2)',
        'magnetic': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      transitionTimingFunction: {
        'apple-signature': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'apple-reveal': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'apple-magnetic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'apple-parallax': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'apple-snappy': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'apple-smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      backdropBlur: {
        'apple': '20px',
        'apple-subtle': '10px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'apple-hero': 'radial-gradient(ellipse at top, rgba(249, 115, 22, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(168, 85, 247, 0.15) 0%, transparent 50%), linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(17, 24, 39) 50%, rgb(30, 41, 59) 100%)',
      },
    },
  },
  plugins: [],
}