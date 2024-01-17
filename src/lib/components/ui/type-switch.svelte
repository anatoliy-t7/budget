<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { types } from '$lib/stores/transactions';
	/**
	 * @type {string | null}
	 */
	export let selected = null;
</script>

<div class="grid w-full max-w-sm grid-cols-3 rounded-lg bg-gray-100 p-1">
	{#each $types as item}
		<button
			on:click={() => ((selected = item), dispatch('changed', item))}
			type="button"
			class="{selected === item
				? 'bg-amber-300 text-amber-950'
				: 'bg-gray-100 text-gray-500'} click rounded-lg p-3 text-base font-medium capitalize transition duration-300">
			{item}
		</button>
	{/each}
</div>
