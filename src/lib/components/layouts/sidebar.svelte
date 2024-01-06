<script lang="ts">
	import Overview from '~icons/solar/graph-broken';
	import Transactions from '~icons/solar/square-transfer-vertical-broken';
	import Settings from '~icons/solar/settings-broken';
	import Transaction from '$lib/components/layouts/transaction-edit.svelte';
	import TransactionView from '$lib/components/layouts/transaction-view.svelte';
	import Plus from '~icons/tabler/plus';
	import { page } from '$app/stores';

	let transactionComponent: Transaction;

	$: activeUrl = $page.url;
	export let links = [
		{
			name: 'Overview',
			url: '/',
			icon: Overview,
		},
		{
			name: 'Transactions',
			url: '/transactions',
			icon: Transactions,
		},
		{
			name: 'Settings',
			url: '/settings',
			icon: Settings,
		},
	];
</script>

<div class="fixed left-0 top-16 z-30 flex h-full min-h-screen w-72 flex-col justify-between p-8">
	<div class="space-y-1 pt-2 text-gray-700">
		<div class="pb-7">
			<button
				on:click={() => transactionComponent.onOpen()}
				class=" inline-flex w-full items-center gap-3 rounded-xl bg-green-700 px-4 py-3 text-left text-base font-medium text-white hover:bg-green-800">
				<Plus class="h-6 w-6" />
				Add transaction
			</button>

			<Transaction bind:this={transactionComponent} />

			<TransactionView on:open={() => transactionComponent.beforeOpen()} />
		</div>

		{#each links as link, a}
			<a
				href={link.url}
				class="{activeUrl.pathname === link.url
					? 'bg-sky-500 font-medium text-white'
					: 'hover:bg-gray-200'} inline-flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base">
				{#if link.icon}
					<svelte:component this={link.icon} class="h-6 w-6" />
				{/if}
				{link.name}
			</a>
		{/each}
	</div>
</div>
