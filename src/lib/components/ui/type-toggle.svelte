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

<div class="grid w-full max-w-xs grid-cols-3 gap-1 rounded-lg bg-gray-100 p-1">
	{#each $types as item}
		<button
			on:click={() => changedType(item)}
			type="button"
			class="{selected === item
				? 'bg-amber-400'
				: 'bg-white text-gray-500 hover:border-sky-400'} rounded-md border border-gray-300 p-2 text-base font-medium capitalize transition duration-300">
			{item}
		</button>
	{/each}
</div>
