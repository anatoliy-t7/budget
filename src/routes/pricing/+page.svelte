<script>
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import PriceList from '$lib/components/ui/price-list.svelte';
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>Pricing | {PUBLIC_APP_NAME}</title>
</svelte:head>

<div transition:fade class="w-full pt-24">
	<PriceList />
</div>
