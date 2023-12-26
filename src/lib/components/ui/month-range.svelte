<script lang="ts">
	import { getOverview, monthRange, overview } from '$lib/stores/transactions';
	import { clickOutside } from '$lib/utils';
	import { authModel } from '$lib/stores/pocketbase';
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

		await getOverview($authModel?.currentBudget);
	}

	async function next() {
		$monthRange.start = dayjs($monthRange.start).add(1, 'M').startOf('month').toISOString();
		$monthRange.end = dayjs($monthRange.end).add(1, 'M').endOf('month').toISOString();

		await getOverview($authModel?.currentBudget);
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
		await getOverview($authModel?.currentBudget);
	}

	$: isFuture = dayjs(dayjs($monthRange.end).add(1, 'M')).isAfter(dayjs(), 'month');
</script>

<div class="inline-flex items-center gap-6 rounded-xl bg-white p-3">
	<div class="flex items-center gap-4">
		<button on:click="{() => prev()}" class="hover">
			<ChevronLeft class="h-7 w-7" />
		</button>

		<div class="flex min-w-24 justify-center text-lg font-medium">
			{#if dayjs($monthRange.start).format('MMMM') !== dayjs($monthRange.end).format('MMMM')}
				{dayjs($monthRange.start).format('MMMM')} -
			{/if}

			{dayjs($monthRange.end).format('MMMM')}
		</div>

		<button
			on:click="{() => next()}"
			class="{isFuture ? 'cursor-not-allowed text-gray-400' : 'hover'} "
			disabled="{isFuture}">
			<ChevronRight class="h-7 w-7" />
		</button>
	</div>

	<div use:clickOutside="{() => (isExpanded = false)}" class="relative">
		<button on:click="{clickHandler}" class="hover flex items-center p-1">
			<Calendar class="h-7 w-7" />
		</button>
		{#if isExpanded}
			<div
				transition:slide
				class="absolute right-0 top-8 w-40 space-y-1 rounded-xl bg-white p-4 text-sm shadow-small">
				<button
					on:click="{() => setRange('current_month')}"
					class="w-full px-2 py-1 text-left hover:bg-gray-100">
					Current month
				</button>
				<button
					on:click="{() => setRange('last_month')}"
					class="w-full px-2 py-1 text-left hover:bg-gray-100">
					Last month
				</button>
				<button
					on:click="{() => setRange('last_3months')}"
					class="w-full px-2 py-1 text-left hover:bg-gray-100">
					Last 3 months
				</button>
				<button
					on:click="{() => setRange('current_year')}"
					class="w-full px-2 py-1 text-left hover:bg-gray-100">
					Current year
				</button>
			</div>
		{/if}
	</div>
</div>
