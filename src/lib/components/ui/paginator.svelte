<script>
	import ChevronLeft from '~icons/solar/alt-arrow-left-linear';
	import ChevronRight from '~icons/solar/alt-arrow-right-linear';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let data = {};

	/**
	 * @param {number} page
	 */
	async function changePage(page) {
		if (!page || page === data.page) return;

		dispatch('onPageChange', page);
	}
</script>

{#if data.totalPages > 1}
	<nav class="pt-6" aria-label="pagination">
		<div class="flex items-center gap-2">
			<button
				disabled={data.page === 1}
				class="grid h-8 items-center rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
				on:click={() => changePage(data.page - 1)}>
				<ChevronLeft class="square-4" />
			</button>
			{#each { length: data.totalPages } as _, i}
				<button
					disabled={data.page === i + 1}
					class="grid h-8 items-center rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 hover:opacity-75 disabled:cursor-not-allowed disabled:bg-gray-200"
					on:click={() => changePage(i + 1)}>
					{i + 1}
				</button>
			{/each}
			<button
				disabled={data.page === data.totalPages}
				class="grid h-8 items-center rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
				on:click={() => changePage(data.page + 1)}>
				<ChevronRight class="square-4" />
			</button>
		</div>
	</nav>
{/if}
