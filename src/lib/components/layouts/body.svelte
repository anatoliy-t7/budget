<script>
	import Sidebar from '$lib/components/layouts/sidebar.svelte';
	import Navbar from '$lib/components/layouts/navbar.svelte';
	import FirstLoadData from '$lib/components/layouts/first-load-data.svelte';
	import Profile from '$lib/components/layouts/profile.svelte';
	import Drawer from '$lib/components/ui/drawer.svelte';
	import { editProfile } from '$lib/stores/main';
	import TransactionView from '$lib/components/layouts/transaction-view.svelte';
	import TransactionEdit from '$lib/components/layouts/transaction-edit.svelte';
	import { checkSubscription, isMobile, trialGone } from '$lib/utils/utils';
	import { isEditOpen } from '$lib/stores/transactions';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	/**
	 * @type {TransactionEdit}
	 */
	let transactionEditComponent;

	$: if (
		(trialGone() && $page.url.pathname !== '/welcome') ||
		(!checkSubscription() && $page.url.pathname !== '/welcome')
	) {
		goto('/pricing');
	}
</script>

<FirstLoadData />

<Navbar />

<div class="{isMobile() ? '' : 'ml-72'} flex h-full md:gap-4">
	<Sidebar />

	<main class="{isMobile() ? 'my-20 px-4' : 'pr-8 pt-24'} page mx-auto max-w-screen-2xl">
		<slot />
	</main>
</div>

<Drawer bind:open={$editProfile} on:close={() => ($editProfile = false)}>
	<Profile />
</Drawer>

<Drawer bind:open={$isEditOpen} on:close={() => transactionEditComponent.onClose()}>
	<TransactionEdit bind:this={transactionEditComponent} />
</Drawer>

<TransactionView />
