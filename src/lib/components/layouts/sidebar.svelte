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

<div class="w-72 fixed top-0 left-0 flex flex-col justify-between h-full min-h-screen p-8">
	<div class="pt-16 space-y-1 text-gray-700">
		{#each links as link, a}
			<a
				href={link.url}
				class="{activeUrl.pathname === link.url
					? 'bg-sky-500 text-white font-medium'
					: 'hover:bg-gray-200'} inline-flex items-center w-full text-base gap-3 rounded-xl px-4 py-3"
			>
				{#if link.icon}
					<svelte:component this={link.icon} class="w-6 h-6" />
				{/if}
				{link.name}
			</a>
		{/each}
	</div>
</div>
