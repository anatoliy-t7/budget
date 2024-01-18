<script>
	import { totalAmountsByCategories, getTotalAmountsByCategories } from '$lib/stores/transactions';
	import { onMount } from 'svelte';

	onMount(async () => {
		if ($totalAmountsByCategories) {
			await getTotalAmountsByCategories();
		}
	});
	$: console.log($totalAmountsByCategories);
</script>

{#if $totalAmountsByCategories?.length}
	<div>
		{#each $totalAmountsByCategories as category}
			<div>{category.name}</div>
		{/each}
	</div>
{/if}
