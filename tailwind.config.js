/** @type {import('tailwindcss').Config} */
// Tokens do design system Sonic Stage.
// Fonte: assets/stitch_band_performance_manager/sonic_stage/DESIGN.md
// Regras: .specify/memory/constitution.md (seções 8.2 e 8.3)
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Interação
        primary: {
          DEFAULT: '#00d1ff', // azul elétrico — ações principais, links, progresso
          hover: '#4cd6ff',
          light: '#a4e6ff',
        },
        accent: {
          DEFAULT: '#ff4b89', // magenta vívido — destaque, "ao vivo", "novo"
          hover: '#ffb1c3',
        },
        tertiary: {
          DEFAULT: '#feb127', // âmbar — uso pontual
        },
        // Superfícies (elevação por camadas tonais)
        canvas: '#000000', // nível 0 — fundo da aplicação
        surface: {
          DEFAULT: '#0a0a0a', // nível 1 — cards, seções, modais
          raised: '#1a1a1a', // nível 2 — hover, elementos flutuantes
          input: '#050505', // campos de formulário
        },
        // Conteúdo
        content: {
          DEFAULT: '#e5e2e1',
          secondary: '#bbc9cf',
          tertiary: '#859399',
        },
        line: {
          DEFAULT: '#1a1a1a',
          strong: '#3c494e',
        },
        // Status
        success: '#4ade80',
        warning: '#feb127',
        danger: {
          DEFAULT: '#ffb4ab',
          container: '#93000a',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['56px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'headline-lg': ['32px', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body-md': ['16px', { lineHeight: '1.5' }],
        'label-lg': ['14px', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '1.2', fontWeight: '500' }],
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(0, 209, 255, 0.3)',
        'glow-primary-strong': '0 0 25px rgba(0, 209, 255, 0.5)',
        'glow-accent': '0 0 15px rgba(255, 75, 137, 0.3)',
        'glow-tertiary': '0 0 15px rgba(254, 177, 39, 0.3)',
      },
      maxWidth: {
        content: '1440px',
      },
    },
  },
  plugins: [],
}
