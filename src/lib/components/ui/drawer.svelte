<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { X } from 'lucide-svelte';

	export let open: boolean = false;
	export let maxWidth: string = 'max-w-xl';

	$: if (open) {
		document.body.classList.toggle('overflow-y-hidden');
	}

	function eventOnEscape(e: any) {
		if (e.key === 'Escape') {
			open = false;
		}
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
			class="transform-gpu fixed top-0 bottom-0 left-0 right-0 z-30 w-screen h-screen overflow-hidden transition bg-gray-700 bg-opacity-50 cursor-pointer pointer-events-auto"
			on:click={() => (open = false)}
		/>
		<div
			transition:slide={{ delay: 0, duration: 400, easing: cubicOut, axis: 'x' }}
			class="{maxWidth} z-60 fixed z-40 inset-y-0 right-0 w-full h-screen px-8 py-6 overflow-y-auto text-gray-600 bg-white"
		>
			<div class="top-6 right-6 absolute">
				<button on:click={() => (open = false)} class="hover">
					<X />
				</button>
			</div>
			<slot />
		</div>
	{/if}
</aside>
