import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'EduIA',
  description: 'Documentación del monorepo EduIA (MVP de tutoría educativa)',
  lang: 'es-ES',
  cleanUrls: true,
  ignoreDeadLinks: [
    // Plantillas de env viven fuera de docs/ (GitHub sí las resuelve).
    (url) => url.includes('.env.example'),
  ],
  rewrites: {
    'README.md': 'index.md',
    'how-to/README.md': 'how-to/index.md',
    'reference/README.md': 'reference/index.md',
    'explanation/README.md': 'explanation/index.md',
    'adr/README.md': 'adr/index.md',
    'runbooks/README.md': 'runbooks/index.md',
    'rfcs/README.md': 'rfcs/index.md',
  },
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Getting started', link: '/getting-started' },
      { text: 'API', link: '/reference/api' },
      { text: 'ADRs', link: '/adr/' },
    ],
    sidebar: [
      {
        text: 'Empezar',
        items: [
          { text: 'Índice', link: '/' },
          { text: 'Getting started', link: '/getting-started' },
        ],
      },
      {
        text: 'How-to',
        items: [
          { text: 'Índice', link: '/how-to/' },
          { text: 'Dispositivo físico', link: '/how-to/run-on-physical-device' },
          { text: 'Modo del tutor', link: '/how-to/switch-tutor-mode' },
          { text: 'Depurar CI', link: '/how-to/debug-ci' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Índice', link: '/reference/' },
          { text: 'API HTTP', link: '/reference/api' },
          { text: 'Environment', link: '/reference/environment' },
          { text: 'Scripts', link: '/reference/scripts' },
        ],
      },
      {
        text: 'Explanation',
        items: [
          { text: 'Índice', link: '/explanation/' },
          { text: 'Arquitectura', link: '/explanation/architecture' },
          { text: 'Design system', link: '/explanation/design-system' },
        ],
      },
      {
        text: 'Decisiones (ADR)',
        items: [
          { text: 'Índice', link: '/adr/' },
          { text: '0001 Stateless API', link: '/adr/0001-stateless-api' },
          { text: '0002 Hexagonal pragmático', link: '/adr/0002-hexagonal-pragmatic' },
          { text: '0003 Sin streaming', link: '/adr/0003-no-streaming-responses' },
          { text: '0004 Fake providers', link: '/adr/0004-fake-providers-always-available' },
          { text: '0005 NativeWind + DS', link: '/adr/0005-nativewind-design-system' },
        ],
      },
      {
        text: 'Runbooks',
        items: [
          { text: 'Índice', link: '/runbooks/' },
          { text: 'Device ↔ API', link: '/runbooks/device-cannot-reach-api' },
          { text: 'CI rojo', link: '/runbooks/ci-red' },
          { text: 'Rate limit 429', link: '/runbooks/rate-limit-429' },
          { text: 'Timeout IA', link: '/runbooks/ai-provider-timeout' },
          { text: 'CORS', link: '/runbooks/cors-errors' },
        ],
      },
      {
        text: 'RFCs',
        items: [
          { text: 'Índice', link: '/rfcs/' },
          { text: 'Template', link: '/rfcs/TEMPLATE' },
        ],
      },
    ],
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/MrLuis-WebMaster/eduIA' },
    ],
    outline: [2, 3],
  },
});
