<script>
	import { slide } from 'svelte/transition';
	import { clickOutside } from '$lib/utils/utils';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let className = 'top-10 right-0';
	export { className as class };
	export let opened = false;

	function clickHandler() {
		opened = !opened;
		dispatch('open');
	}
</script>

<div use:clickOutside={() => (opened = false)} class="relative inline-block w-full">
	<button type="button" on:click={clickHandler} class="click w-full">
		<slot name="trigger" />
	</button>
	{#if opened}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div transition:slide tabindex="0" role="button" class="absolute z-50 {className}">
			<slot name="content" />
		</div>
	{/if}
</div>
