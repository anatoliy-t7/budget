<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
	import Auth from '$lib/components/auth/auth.svelte';
	import { goto } from '$app/navigation';
	import { authModel } from '$lib/pocketbase';
	import Sidebar from '$lib/components/layouts/sidebar.svelte';

	export let destination: string | null = null;
	$: if (destination != null && $authModel) {
		goto(destination);
	}

	$: console.log($authModel);
</script>

{#if $authModel}
	<div class="bg-slate-100 relative flex w-full h-full p-2">
		<Sidebar />
		<div class="page rounded-xl md:p-8 w-full h-full p-4 ml-32 bg-white">
			<slot />
		</div>
	</div>
{:else}
	<Auth />
{/if}

<Toaster />
