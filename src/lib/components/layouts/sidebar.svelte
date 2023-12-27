<script lang="ts">
	import Overview from '~icons/solar/graph-broken';
	import Transactions from '~icons/solar/square-transfer-vertical-broken';

	import { page } from '$app/stores';

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
	];
</script>

<div class="fixed left-0 top-0 z-10 flex h-full min-h-screen w-72 flex-col justify-between p-8">
	<div class="space-y-1 pt-16 text-gray-700">
		{#each links as link, a}
			<a
				href="{link.url}"
				class="{activeUrl.pathname === link.url
					? 'bg-sky-500 font-medium text-white'
					: 'hover:bg-gray-200'} inline-flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base">
				{#if link.icon}
					<svelte:component this="{link.icon}" class="h-6 w-6" />
				{/if}
				{link.name}
			</a>
		{/each}
	</div>
</div>
