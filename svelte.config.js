import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// inlineStyleThreshold: Infinity,
		adapter: adapter(),
		alias: {
			$components: 'src/lib/components',
		},
	},
	preprocess: vitePreprocess(),
};
export default config;