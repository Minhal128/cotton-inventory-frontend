/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F7F7F8',
        sidebar: '#F2F2F3',
        surface: '#FFFFFF',
        'surface-2': '#FAFAFB',
        border: '#E5E7EB',
        ink: '#1F2937',
        'ink-2': '#6B7280',
        'ink-3': '#9CA3AF',
        primary: { DEFAULT: '#7C4DFF', hover: '#6D3EF5', soft: '#F3EEFF' },
        success: { DEFAULT: '#22C55E', soft: '#ECFDF3' },
        warning: { DEFAULT: '#F59E0B', soft: '#FFF7E6' },
        danger: { DEFAULT: '#EF4444', soft: '#FEF2F2' },
        info: { DEFAULT: '#3B82F6', soft: '#EFF6FF' },
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
      boxShadow: { card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)' },
    },
  },
  plugins: [],
};
