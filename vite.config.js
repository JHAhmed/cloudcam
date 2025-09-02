import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// export default defineConfig({
// 	plugins: [tailwindcss(), sveltekit()]
// });

export default defineConfig({
  plugins: [
	tailwindcss(),
    sveltekit(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the PWA when new content is available
      manifest: {
        name: 'CloudCam',
        short_name: 'CloudCam',
        description: 'Bypass your device storage limitations.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png', // path to your app icon
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png', // path to your app icon
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable', // A maskable icon ensures it looks great on all devices
          },
        ],
      },
      // Optional: Workbox configuration for fine-grained caching control
      workbox: {
         globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}']
      }
    })
  ]
});