<script lang="ts">
	import Loader from '~icons/solar/refresh-linear';

	let className = '';
	export { className as class };
	export let loading = false;
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
	export let small = false;

	export let theme = 'default';
	let classes =
		'text-white bg-green-700 border-green-700 hover:bg-green-800 focus:outline-none ring-green-200 focus:ring-green-200';

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
	type="{type}"
	disabled="{disabled}"
	class="
        {className}
        {classes}
        {disabled && !loading && 'cursor-not-allowed'}
        {loading && 'cursor-wait'}
		{small ? 'px-3 py-2' : 'px-4 py-3'}
        inline-flex w-full select-none items-center justify-center gap-2 border font-medium transition focus:outline-none focus:ring-[3px] disabled:border-gray-300 disabled:bg-gray-300">
	{#if loading}
		<Loader class="animate-spin" />
	{/if}
	<slot />
</button>
