import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
// import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
	plugins: [
		sveltekit(),
		// visualizer({
		// 	emitFile: true,
		// 	filename: "stats.html",
		// }),
		SvelteKitPWA({
			srcDir: './src',
			mode: 'production',
			strategies: 'generateSW',
			filename: undefined,
			scope: '/',
			base: '/',
			selfDestroying: false,
			manifest: {
				short_name: 'Budget',
				name: 'Budget',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				icons: [
					{
						src: '/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
				],
			},
			injectManifest: { globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,webmanifest}'] },
			workbox: { globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,webmanifest}'] },
			devOptions: {
				enabled: true,
				suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
				type: 'module',
				navigateFallback: '/',
			},
			// if you have shared info in svelte config file put in a separate module and use it also here
			kit: {
				includeVersionFile: true,
			},
		}),
		Icons({
			compiler: 'svelte',
		}),
	],
});
