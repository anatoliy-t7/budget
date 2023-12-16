<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import { client, authModel } from '$lib/pocketbase';
	import { onNavigate } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';

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
</script>

{#if $authModel}
	<div class="bg-gray-50 relative">
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
