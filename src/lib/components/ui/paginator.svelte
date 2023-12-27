<script lang="ts">
	import ChevronLeft from '~icons/solar/alt-arrow-left-linear';
	import ChevronRight from '~icons/solar/alt-arrow-right-linear';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let data: any = {};

	async function changePage(page: number) {
		if (!page || page === data.page) return;

		dispatch('onPageChange', page);
	}
</script>

{#if data.totalPages > 1}
	<nav class="pt-6" aria-label="pagination">
		<div class="flex items-center gap-2">
			<button
				disabled="{data.page === 1}"
				class="hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-100 disabled:text-gray-400 grid items-center h-8 px-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-md"
				on:click="{() => changePage(data.page - 1)}">
				<ChevronLeft class="square-4" />
			</button>
			{#each { length: data.totalPages } as _, i}
				<button
					disabled="{data.page === i + 1}"
					class="hover:opacity-75 disabled:cursor-not-allowed disabled:bg-gray-200 grid items-center h-8 px-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-md"
					on:click="{() => changePage(i + 1)}">
					{i + 1}
				</button>
			{/each}
			<button
				disabled="{data.page === data.totalPages}"
				class="hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-100 disabled:text-gray-400 grid items-center h-8 px-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-md"
				on:click="{() => changePage(data.page + 1)}">
				<ChevronRight class="square-4" />
			</button>
		</div>
	</nav>
{/if}
