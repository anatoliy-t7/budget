<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { types } from '$lib/stores/transactions';
	export let selected: any = null;

	async function changedType(value: string | null) {
		if (selected === value) {
			value = '';
		}
		selected = value;
		dispatch('changed', value);
	}
</script>

<div class="grid w-full max-w-xs grid-cols-3">
	{#each $types as item, index}
		<button
			on:click={() => changedType(item)}
			type="button"
			class="{selected === item
				? 'border-amber-400 bg-amber-400'
				: 'border-gray-400 bg-white text-gray-500 hover:bg-gray-100'}
				{index === 0 && 'rounded-l-lg border border-r-0'}
				{$types.length === index + 1 && 'rounded-r-lg border border-l-0'}
				{index !== 0 && $types.length !== index + 1 && 'border'}
				   px-2 py-2.5 text-base font-medium capitalize transition duration-300">
			{item}
		</button>
	{/each}
</div>
