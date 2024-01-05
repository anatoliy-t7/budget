<script lang="ts">
	import Loader from '~icons/solar/refresh-linear';

	let className = '';
	export { className as class };
	export let loading = false;
	export let disabled = false;
	export let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';

	export let size = 'md';
	let sizeClass = 'px-4 py-2.5 text-base';

	switch (size) {
		case 'xs':
			sizeClass = 'px-2 py-1 text-xs';
			break;
		case 'sm':
			sizeClass = 'px-3 py-2 text-sm';
			break;
		case 'md':
			sizeClass = 'px-4 py-2.5 text-base';
			break;
		case 'lg':
			sizeClass = 'px-5 py-4 text-lg';
			break;
		default:
			break;
	}

	export let color = 'green';
	let colorClass =
		'text-white bg-green-700 border-green-700 hover:bg-green-800 ring-green-200 focus:ring-green-200';

	switch (color) {
		case 'amber':
			colorClass =
				'bg-amber-400 hover:bg-amber-500 ring-amber-200 focus:ring-amber-200 text-gray-800 border-amber-400 hover:border-amber-500';
			break;
		case 'green':
			colorClass =
				'text-white bg-green-700 border-green-700 hover:bg-green-800 ring-green-200 focus:ring-green-200';
			break;
		case 'outline':
			colorClass =
				'bg-white hover:bg-gray-100 focus:bg-gray-100 border-gray-300 focus:border-gray-300 ring-gray-200 focus:ring-gray-200';
			break;
		case 'outline-green':
			colorClass =
				'bg-white hover:bg-border-800 hover:bg-green-50 text-green-700 border-green-700 focus:ring-green-600';
			break;
		case 'blue':
			colorClass =
				'bg-sky-500 hover:bg-sky-400 ring-sky-200 focus:ring-sky-200 text-gray-700 border-sky-500 hover:border-sky-400 text-white';
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
	type={type}
	disabled={disabled}
	class="
		{sizeClass}
		{colorClass}
        {className}
        {disabled && !loading && 'cursor-not-allowed'}
        {loading && 'cursor-wait'}
        inline-flex select-none items-center justify-center gap-2 rounded-lg border font-medium transition focus:outline-none focus:ring-[3px] disabled:border-gray-300 disabled:bg-gray-300">
	{#if loading}
		<Loader class="animate-spin" />
	{/if}
	<slot />
</button>
