<script lang="ts">
	import { Loader2 } from 'lucide-svelte';

	let className = '';
	export { className as class };
	export let loading = false;
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
	export let small = false;

	export let theme = 'default';
	let classes =
		'text-white bg-green-500 hover:bg-green-600 focus:outline-none ring-green-200 focus:ring-green-200';

	switch (theme) {
		case 'secondary':
			classes =
				'bg-amber-200 hover:bg-amber-400 focus:outline-none ring-amber-200 focus:ring-amber-200 text-gray-700 border-amber-200 hover:border-amber-400';
			break;
		case 'empty':
			classes =
				'bg-gray-50 hover:bg-gray-100 focus:bg-gray-100 border-gray-300 focus:border-gray-300 ring-gray-200 focus:ring-gray-200';
			break;
		default:
			break;
	}
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<button
	on:click
	on:mouseover
	on:mouseenter
	on:mouseleave
	{type}
	{disabled}
	class="
        {className}
        {classes}
        {disabled && !loading && 'cursor-not-allowed'}
        {loading && 'cursor-wait'}
		{small ? 'py-2 px-3' : 'py-3 px-4'}
        transition w-full inline-flex items-center justify-center text-sm font-medium border focus:ring-[3px] focus:outline-none gap-2 select-none disabled:bg-gray-400 disabled:border-gray-400"
>
	{#if loading}
		<Loader2 class="animate-spin" />
	{/if}
	<slot />
</button>
