import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://riwashouse.live',
  integrations: [react(), sitemap()],
  adapter: vercel(),
  vite: {
    ssr: {
      noExternal: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
    },
  },
});
