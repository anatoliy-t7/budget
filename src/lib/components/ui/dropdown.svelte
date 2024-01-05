<script>
	import { slide } from 'svelte/transition';
	import { clickOutside } from '$lib/utils';

	let className = 'top-10 right-0';
	export { className as class };
	let isExpanded = false;

	function clickHandler() {
		isExpanded = !isExpanded;
	}
</script>

<div use:clickOutside={() => (isExpanded = false)} class="relative inline-block w-full">
	<button on:click={clickHandler} class="w-full">
		<slot name="trigger" />
	</button>
	{#if isExpanded}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			on:click={() => (isExpanded = false)}
			transition:slide
			tabindex="0"
			role="button"
			class="absolute z-50 {className}">
			<slot name="content" />
		</div>
	{/if}
</div>
