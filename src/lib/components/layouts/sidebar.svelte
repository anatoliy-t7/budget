<script lang="ts">
	import { ActivitySquare, BarChartBig } from 'lucide-svelte';

	import { page } from '$app/stores';

	$: activeUrl = $page.url;
	export let links = [
		{
			name: 'Overview',
			url: '/',
			icon: BarChartBig,
		},
		{
			name: 'Transactions',
			url: '/transactions',
			icon: ActivitySquare,
		},
	];
</script>

<div class="w-60 fixed top-0 left-0 flex flex-col justify-between h-full min-h-screen p-8">
	<div class="pt-12 space-y-1 text-gray-700">
		{#each links as link, a}
			<a
				href={link.url}
				class="{activeUrl.pathname === link.url
					? 'bg-gray-100'
					: ''} inline-flex items-center w-full text-sm gap-3 hover:bg-gray-200 rounded-lg p-2"
			>
				{#if link.icon}
					<svelte:component this={link.icon} />
				{/if}
				{link.name}
			</a>
		{/each}
	</div>
</div>
