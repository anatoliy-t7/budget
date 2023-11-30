<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { types } from '$lib/stores/transactions';
	export let selected: any = null;
</script>

<div class="bg-gray-50 grid w-full max-w-xs grid-cols-3 p-1 rounded-lg">
	{#each $types as item}
		<button
			on:click={() => ((selected = item), dispatch('changed', item))}
			type="button"
			class="{selected === item
				? 'bg-amber-400'
				: 'bg-gray-50 text-gray-500'} p-3 rounded-lg transition duration-300 text-base capitalize font-medium"
		>
			{item}
		</button>
	{/each}
</div>
