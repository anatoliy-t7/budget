<script lang="ts">
	import Overview from '~icons/solar/graph-broken';
	import Transactions from '~icons/solar/square-transfer-vertical-broken';
	import Settings from '~icons/solar/settings-broken';

	import Plus from '~icons/tabler/plus';
	import { page } from '$app/stores';
	import { isEditOpen, onOpenEdit } from '$lib/stores/transactions';

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

<div class="fixed left-0 top-16 z-40 flex h-full min-h-screen w-72 flex-col justify-between p-8">
	<div class="space-y-1 pt-2 text-gray-700">
		<div class="pb-7">
			<button
				on:click={() => onOpenEdit()}
				class="click inline-flex w-full items-center gap-3 rounded-xl border border-green-300 bg-green-300 px-4 py-3 text-left text-base font-medium text-green-950 hover:border-green-400 hover:bg-green-400">
				<Plus class="h-6 w-6" />
				Add transaction
			</button>
		</div>

		{#each links as link, a}
			<a
				href={link.url}
				class="{activeUrl.pathname === link.url
					? 'border-gray-500 font-medium '
					: 'border-transparent hover:border-gray-400'} click inline-flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-base">
				{#if link.icon}
					<svelte:component this={link.icon} class="h-6 w-6" />
				{/if}
				{link.name}
			</a>
		{/each}
	</div>
</div>
