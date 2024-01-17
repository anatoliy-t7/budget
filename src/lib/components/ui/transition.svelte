<script>
	import { fade } from 'svelte/transition';
	/**
	 * @type {URL}
	 */
	export let url;
</script>

{#key url}
	<div in:fade={{ duration: 200, delay: 200 }}>
		<slot />
	</div>
{/key}
