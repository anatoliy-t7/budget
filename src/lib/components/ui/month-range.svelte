<script lang="ts">
	import { onMount } from 'svelte';
	import { loadData, monthRange } from '$lib/stores/transactions';
	import { clickOutside } from '$lib/utils';
	import dayjs from 'dayjs';
	import { slide } from 'svelte/transition';
	import Calendar from '~icons/solar/calendar-linear';
	import ChevronLeft from '~icons/solar/round-alt-arrow-left-linear';
	import ChevronRight from '~icons/solar/round-alt-arrow-right-linear';

	let isExpanded = false;

	function clickHandler() {
		isExpanded = !isExpanded;
	}

	async function prev() {
		$monthRange.start = dayjs($monthRange.start).subtract(1, 'M').startOf('month').toISOString();
		$monthRange.end = dayjs($monthRange.end).subtract(1, 'M').endOf('month').toISOString();

		await loadData();
	}

	async function next() {
		$monthRange.start = dayjs($monthRange.start).add(1, 'M').startOf('month').toISOString();
		$monthRange.end = dayjs($monthRange.end).add(1, 'M').endOf('month').toISOString();

		await loadData();
	}

	async function setRange(mode: String) {
		switch (mode) {
			case 'current_month':
				$monthRange.start = dayjs().startOf('month').toISOString();
				$monthRange.end = dayjs().endOf('month').toISOString();
				break;
			case 'last_month':
				$monthRange.start = dayjs().subtract(1, 'M').startOf('month').toISOString();
				$monthRange.end = dayjs().subtract(1, 'M').endOf('month').toISOString();
				break;
			case 'last_3months':
				$monthRange.start = dayjs().subtract(2, 'M').startOf('month').toISOString();
				$monthRange.end = dayjs().endOf('month').toISOString();
				break;
			case 'current_year':
				$monthRange.start = dayjs().startOf('y').toISOString();
				$monthRange.end = dayjs().endOf('y').toISOString();
				break;
			default:
				break;
		}

		isExpanded = false;
		await loadData();
	}

	$: isFuture = dayjs(dayjs($monthRange.end).add(1, 'M')).isAfter(dayjs(), 'month');

	onMount(async () => {
		await loadData();
	});
</script>

<div class="rounded-xl inline-flex items-center gap-6 p-3 bg-white">
	<div class="flex items-center gap-4">
		<button on:click={() => prev()} class="hover">
			<ChevronLeft class="w-7 h-7" />
		</button>

		<div class="min-w-24 flex justify-center text-lg font-medium">
			{#if dayjs($monthRange.start).format('MMMM') !== dayjs($monthRange.end).format('MMMM')}
				{dayjs($monthRange.start).format('MMMM')} -
			{/if}

			{dayjs($monthRange.end).format('MMMM')}
		</div>

		<button
			on:click={() => next()}
			class="{isFuture ? 'text-gray-400 cursor-not-allowed' : 'hover'} "
			disabled={isFuture}
		>
			<ChevronRight class="w-7 h-7" />
		</button>
	</div>

	<div use:clickOutside={() => (isExpanded = false)} class="relative">
		<button on:click={clickHandler} class="hover flex items-center p-1">
			<Calendar class="w-7 h-7" />
		</button>
		{#if isExpanded}
			<div
				transition:slide
				class="top-8 shadow-small rounded-xl absolute right-0 w-40 p-4 space-y-1 text-sm bg-white"
			>
				<button
					on:click={() => setRange('current_month')}
					class="hover:bg-gray-100 w-full px-2 py-1 text-left"
				>
					Current month
				</button>
				<button
					on:click={() => setRange('last_month')}
					class="hover:bg-gray-100 w-full px-2 py-1 text-left"
				>
					Last month
				</button>
				<button
					on:click={() => setRange('last_3months')}
					class="hover:bg-gray-100 w-full px-2 py-1 text-left"
				>
					Last 3 months
				</button>
				<button
					on:click={() => setRange('current_year')}
					class="hover:bg-gray-100 w-full px-2 py-1 text-left"
				>
					Current year
				</button>
			</div>
		{/if}
	</div>
</div>
