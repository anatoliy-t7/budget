<script>
	import { slide, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import X from '~icons/tabler/x';
	import { createEventDispatcher } from 'svelte';

	export let open = false;
	export let maxWidth = 'max-w-2xl';

	const dispatch = createEventDispatcher();

	$: if (open) {
		document.body.classList.add('overflow-hidden');
	} else {
		document.body.classList.remove('overflow-hidden');
	}

	/**
	 * @param {{ key: string; }} e
	 */
	async function eventOnEscape(e) {
		if (e.key === 'Escape') {
			await onClose();
		}
	}

	async function onClose() {
		dispatch('close');
	}

	onMount(() => {
		document.addEventListener('keydown', eventOnEscape);

		return () => {
			window.removeEventListener('keydown', eventOnEscape);
		};
	});
</script>

<aside>
	{#if open}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			transition:fade={{ delay: 0, duration: 300 }}
			class="transform-gpu py-safe fixed top-0 bottom-0 left-0 right-0 z-50 w-screen h-screen overflow-hidden transition bg-gray-700 bg-opacity-50 cursor-pointer pointer-events-auto"
			on:click={onClose}>
		</div>
		<div
			transition:slide={{ delay: 0, duration: 400, easing: cubicOut, axis: 'x' }}
			class="{maxWidth} z-60 fixed inset-y-0 right-0 z-50 h-screen w-full overflow-y-auto bg-gray-50 px-8 text-gray-600 py-safe sm:py-6">
			<div class="right-6 top-6 absolute">
				<button on:click={onClose} class="hovered click mt-safe">
					<X class="w-6 h-6" />
				</button>
			</div>
			<slot />
		</div>
	{/if}
</aside>
