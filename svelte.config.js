import { preprocessMeltUI } from '@melt-ui/pp';
import sequence from 'svelte-sequential-preprocessor';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	preprocess: sequence([vitePreprocess({}), preprocessMeltUI()]),
	kit: {
		adapter: adapter({
			fallback: 'index.html',
			// enable SPA mode
		}),
		alias: {
			$lib: './src/lib',
		},
	},
};
export default config;
