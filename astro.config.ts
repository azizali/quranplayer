// @ts-check
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import { defineConfig } from 'astro/config';
import type { ManifestOptions } from "vite-plugin-pwa";
import { VitePWA } from "vite-plugin-pwa";

const manifest: Partial<ManifestOptions> = {
  "theme_color": "#8936FF",
  "background_color": "#2EC6FE",
  "icons": [
    {
      "purpose": "maskable",
      "sizes": "512x512",
      "src": "icon512_maskable.png",
      "type": "image/png"
    },
    {
      "purpose": "any",
      "sizes": "512x512",
      "src": "icon512_rounded.png",
      "type": "image/png"
    }
  ],
  "orientation": "any",
  "display": "standalone",
  "dir": "ltr",
  "lang": "en-US",
  "name": "Hifz Helper",
  "short_name": "Hifz Helper",
  "start_url": "https://quran.azizali.com/"
}

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), compress()],
  vite: {
		plugins: [
			VitePWA({
				registerType: "autoUpdate",
				manifest,
				workbox: {
				  globDirectory: 'dist',
				  globPatterns: [
				    '**/*.{js,css,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}',
				  ],
				  // Don't fallback on document based (e.g. `/some-page`) requests
				  // This removes an errant console.log message from showing up.
				  navigateFallback: null,
				},
			})
		]
	}
});