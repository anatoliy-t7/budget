import sequence from 'svelte-sequential-preprocessor';
import adapter from 'svelte-adapter-bun';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	preprocess: sequence([vitePreprocess({})]),
	kit: {
		adapter: adapter(),
		serviceWorker: {
			register: false,
		},
	},
};
export default config;
