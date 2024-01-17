<script>
	import '$lib/css/app.css';

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
	import TransactionEdit from '$lib/components/layouts/transaction-edit.svelte';
	import TransactionView from '$lib/components/layouts/transaction-view.svelte';
	import { isMobile } from '$lib/utils/utils';
	import NeedVerification from '$lib/components/layouts/need-verification.svelte';

	/**
	 * @type {string | URL | null}
	 */
	export let destination = null;
	$: if (destination != null && $authModel) {
		goto(destination);
	}
</script>

{#if $authModel}
	{#if !$authModel.verified}
		<NeedVerification />
	{:else}
		<FirstLoadData />

		<Navbar />

		<div class="{isMobile() ? '' : 'ml-72'} flex h-full w-auto gap-4">
			<Sidebar />

			<main class="{isMobile() ? 'px-4 pb-24 pt-20' : 'mt-2 pr-8 pt-24'} page relative">
				<slot />
			</main>
		</div>

		<Drawer bind:open={$editProfile} on:close={() => ($editProfile = false)}>
			<Profile />
		</Drawer>

		<TransactionEdit />
		<TransactionView />
	{/if}
{/if}

{#if !$authModel}
	<Auth />
{/if}

<Toaster />
