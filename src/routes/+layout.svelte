<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import { client, authModel } from '$lib/pocketbase';
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';

	import Auth from '$lib/components/auth/auth.svelte';
	import Sidebar from '$lib/components/layouts/sidebar.svelte';
	import Navbar from '$lib/components/layouts/navbar.svelte';

	export let destination: string | null = null;
	$: if (destination != null && $authModel) {
		goto(destination);
	}

	const coll = client.collection('transactions');

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	// $: if ($authModel) {
	// 	coll.subscribe('*', function (e) {
	// 		console.log(e.action);
	// 		console.log(e.record);
	// 	});
	// } else {
	// 	coll.unsubscribe();
	// }

	// $: console.log($authModel);

	onMount(async () => {
		// if (pwaInfo) {
		// 	const { registerSW } = await import('virtual:pwa-register');
		// 	registerSW({
		// 		immediate: true,
		// 		onRegistered(r: any) {
		// 			// uncomment following code if you want check for updates
		// 			r &&
		// 				setInterval(() => {
		// 					console.log('Checking for sw update');
		// 					r.update();
		// 				}, 20000 /* 20s for testing purposes */);
		// 			console.log(`SW Registered: ${r}`);
		// 		},
		// 		onRegisterError(error: Error) {
		// 			console.log('SW registration error', error);
		// 		},
		// 	});
		// }
	});

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	{@html webManifest}
</svelte:head>

{#if $authModel}
	<div class="relative">
		<Navbar />

		<div class="ml-60 flex w-auto h-full gap-4 pt-20">
			<Sidebar />

			<main class="page pr-8">
				<slot />
			</main>
		</div>
	</div>
{:else}
	<Auth />
{/if}

<Toaster />
