<script lang="ts">
	import '../app.css';

	import { Toaster } from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import { authModel } from '$lib/stores/pocketbase';

	import Auth from '$lib/components/auth/auth.svelte';
	import Sidebar from '$lib/components/layouts/sidebar.svelte';
	import Navbar from '$lib/components/layouts/navbar.svelte';
	import FirstLoadData from '$lib/components/layouts/first-load-data.svelte';
	import Profile from '$lib/components/layouts/profile.svelte';
	import Drawer from '$lib/components/ui/drawer.svelte';
	import { editProfile } from '$lib/stores/main';

	export let destination: string | null = null;
	$: if (destination != null && $authModel) {
		goto(destination);
	}
</script>

{#if $authModel}
	<FirstLoadData />
	<div class="relative bg-brand">
		<Navbar />

		<div class="ml-72 flex h-full w-auto gap-4">
			<Sidebar />

			<main class="page relative mt-2 pr-8 pt-24">
				<slot />
			</main>
		</div>

		<Drawer bind:open={$editProfile} on:close={() => ($editProfile = false)}>
			<Profile />
		</Drawer>
	</div>
{:else}
	<Auth />
{/if}

<Toaster />
