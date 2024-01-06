<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { types } from '$lib/stores/transactions';
	export let selected: any = null;
</script>

<div class="grid w-full max-w-sm grid-cols-3 rounded-lg bg-gray-100 p-1">
	{#each $types as item}
		<button
			on:click={() => ((selected = item), dispatch('changed', item))}
			type="button"
			class="{selected === item
				? 'bg-amber-400 text-gray-800'
				: 'bg-gray-100 text-gray-500'} rounded-lg p-3 text-base font-medium capitalize transition duration-300">
			{item}
		</button>
	{/each}
</div>
