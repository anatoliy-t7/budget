import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	],
	server: {
		proxy: {
			// proxy "/api" and "/_" to pocketbase_url
			"/api": "http://localhost:8090",
			"/_": "http://localhost:8090",
		},
	},
});
