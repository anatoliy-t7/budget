<script lang="ts">
	import { Loader2 } from 'lucide-svelte';

	let className = '';
	export { className as class };
	export let loading = false;
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';

	export let theme = 'default';
	let classes =
		'text-white bg-lime-600 hover:bg-lime-700 focus:outline-none ring-lime-200 focus:ring-lime-200';

	switch (theme) {
		case 'secondary':
			classes =
				'bg-amber-600 hover:bg-amber-700 focus:outline-none ring-amber-200 focus:ring-amber-200';
			break;
		case 'empty':
			classes =
				'bg-gray-50 hover:bg-slate-100 focus:bg-slate-100 border-slate-300 focus:border-slate-300 ring-slate-200 focus:ring-slate-200';
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
        transition w-full inline-flex items-center justify-center py-3 px-4 rounded-lg text-sm font-medium border focus:ring-[3px] focus:outline-none gap-2"
>
	{#if loading}
		<Loader2 class="animate-spin" />
	{/if}
	<slot />
</button>
