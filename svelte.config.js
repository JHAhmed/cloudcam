// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapterAuto from '@sveltejs/adapter-auto';
import adapterStatic from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// Use adapter-static if the `BUILD_STATIC` env var is set
		adapter: process.env.BUILD_STATIC
			? adapterStatic({
					// Options for the static build
					pages: 'build',
					assets: 'build',
					fallback: 'index.html', // Use 'index.html' as SPA fallback
					precompress: false,
					strict: true
				})
			: adapterAuto(),
		alias: {
			$components: 'src/lib/components'
		}
	}
};

export default config;
