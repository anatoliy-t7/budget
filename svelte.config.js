
import sequence from 'svelte-sequential-preprocessor';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	preprocess: sequence([vitePreprocess({})]),
	kit: {
		adapter: adapter({
			fallback: 'index.html',
			// enable SPA mode
		}),
		serviceWorker: {
			register: false,
		},
	},
};
export default config;
