<script lang="ts">
	let className = '';
	export { className as class };
	export let loading = false;
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';

	export let theme = 'default';
	let classes = 'bg-green-500 text-white border-green-500';

	switch (theme) {
		case 'default':
			classes = 'bg-green-500 text-white border-green-500';
			break;
		case 'secondary':
			classes = 'bg-yellow-300 text-slate-900 border-yellow-300';
			break;
		case 'empty':
			classes = 'bg-transparent text-slate-900 border-slate-900';
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
        {disabled && 'cursor-not-allowed'}
        {loading && 'cursor-wait'}
        flex gap-2 items-center justify-center py-2 px-4 focus:outline-none focus:ring-0 hover:brightness-90 border"
>
	{#if loading}
		loadConfigFromFile{/if}
	<slot />
</button>
