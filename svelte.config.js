import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			// default options are fine
			pages: 'build',
			assets: 'build',
			fallback: 'index.html', // Can be useful for SPA-style routing
			precompress: false,
			strict: true
		}),
		prerender: {
			// This ensures every page is built as a static HTML file
			entries: ['*']
		}
	}
};

export default config;
