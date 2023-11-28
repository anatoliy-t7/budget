<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { openCreateModal } from '$lib/stores/transactions';
	const dispatch = createEventDispatcher();

	// by default Drawer opens from right. Make left-0 for left opening
	export let placement = 'right-0';
	// max size of content section
	export let maxScreenSize = 'max-w-lg';

	const handleClickAway = () => {
		dispatch('clickAway');
		$openCreateModal = !$openCreateModal;
	};

	let mounted = false;
	// scrolllock for content underneath
	function scrollLock() {
		if (mounted) {
			const body = document.querySelector('body');
			body.style.overflow = $openCreateModal ? 'hidden' : 'auto';
		}
	}
</script>

<aside>
	<div
		class="fixed inset-0 w-full h-full z-50 overflow-hidden {$openCreateModal
			? 'visible'
			: 'invisible'}"
	>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="w-screen h-full bg-gray-500 cursor-pointer duration-500 transition-opacity overflow-hidden {$openCreateModal
				? 'opacity-50'
				: 'opacity-0'}"
			on:click={handleClickAway}
		/>
		<div
			class="absolute {placement} top-0 shadow-xl overflow-y-auto bg-white transition-all duration-500 h-full {maxScreenSize} {$openCreateModal
				? 'w-screen'
				: 'w-0'}"
		>
			<slot />
		</div>
	</div>
</aside>
