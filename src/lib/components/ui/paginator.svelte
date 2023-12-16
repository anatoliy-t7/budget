<script lang="ts">
	import { createPagination, melt } from '@melt-ui/svelte';
	import ChevronLeft from '~icons/solar/alt-arrow-left-linear';
	import ChevronRight from '~icons/solar/alt-arrow-right-linear';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let data: any = {};

	async function changePage(page: number) {
		if (!page || page === data.page) return;

		dispatch('onPageChange', page);
	}

	const {
		elements: { root, pageTrigger, prevButton, nextButton },
		states: { pages, range },
	} = createPagination({
		count: data.totalItems,
		perPage: data.perPage,
		defaultPage: 1,
		siblingCount: 1,
	});
</script>

{#if data.totalPages > 1}
	<nav class="flex items-center justify-center pt-6" aria-label="pagination" use:melt={$root}>
		<div class="flex items-center gap-2">
			<button
				disabled={data.page === 1}
				class="hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-white disabled:text-gray-400 grid items-center h-8 px-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-md"
				on:click={() => changePage(data.page - 1)}
			>
				<ChevronLeft class="square-4" />
			</button>
			{#each $pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<span>...</span>
				{:else}
					<button
						disabled={data.page === page.value}
						class="hover:opacity-75 disabled:cursor-not-allowed disabled:bg-gray-200 grid items-center h-8 px-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-md"
						use:melt={$pageTrigger(page)}
						on:click={() => changePage(page.value)}
					>
						{page.value}
					</button>
				{/if}
			{/each}
			<button
				disabled={data.page === data.totalPages}
				class="hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-white disabled:text-gray-400 grid items-center h-8 px-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-md"
				on:click={() => changePage(data.page + 1)}
			>
				<ChevronRight class="square-4" />
			</button>
		</div>
	</nav>
{/if}
