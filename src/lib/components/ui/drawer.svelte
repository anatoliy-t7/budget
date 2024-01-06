<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import X from '~icons/tabler/x';
	import { createEventDispatcher } from 'svelte';

	export let open: boolean = false;
	export let maxWidth: string = 'max-w-xl';

	const dispatch = createEventDispatcher();

	$: if (open) {
		document.body.classList.add('overflow-hidden');
	} else {
		document.body.classList.remove('overflow-hidden');
	}

	async function eventOnEscape(e: any) {
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
			class="pointer-events-auto fixed bottom-0 left-0 right-0 top-0 z-40 h-screen w-screen transform-gpu cursor-pointer overflow-hidden bg-gray-700 bg-opacity-50 transition"
			on:click={onClose}>
		</div>
		<div
			transition:slide={{ delay: 0, duration: 400, easing: cubicOut, axis: 'x' }}
			class="{maxWidth} z-60 fixed inset-y-0 right-0 z-50 h-screen w-full overflow-y-auto bg-gray-50 px-8 py-6 text-gray-600">
			<div class="absolute right-6 top-6">
				<button on:click={onClose} class="hover">
					<X class="h-6 w-6" />
				</button>
			</div>
			<slot />
		</div>
	{/if}
</aside>
