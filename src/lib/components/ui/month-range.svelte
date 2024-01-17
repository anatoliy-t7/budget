<script>
	import { getOverview, monthRange, getTransactions } from '$lib/stores/transactions';
	import { budget } from '$lib/stores/main';
	import { clickOutside, isMobile } from '$lib/utils/utils';
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

		await getOverview();
		await getTransactions(1);
	}

	async function next() {
		$monthRange.start = dayjs($monthRange.start).add(1, 'M').startOf('month').toISOString();
		$monthRange.end = dayjs($monthRange.end).add(1, 'M').endOf('month').toISOString();

		await getOverview();
		await getTransactions(1);
	}

	/**
	 * @param {string} mode
	 */
	async function setRange(mode) {
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
			case 'current_finance_year':
				// TODO setup it properly, now iy is wrong
				$monthRange.start = dayjs()
					.startOf('y')
					.set('month', $budget?.settings?.financeYearStartFrom)
					.toISOString();

				$monthRange.end = dayjs()
					.endOf('y')
					.set('month', $budget?.settings?.financeYearStartFrom - 1)
					.toISOString();
				break;
			default:
				break;
		}

		isExpanded = false;
		await getOverview();
		await getTransactions(1);
	}

	$: isFuture = dayjs(dayjs($monthRange.end).add(1, 'M')).isAfter(dayjs(), 'month');
	$: isPast = dayjs().isAfter(dayjs($monthRange.start), 'year');
	$: monthFormat = isMobile() ? 'MMM' : 'MMMM';
</script>

<div class="inline-flex items-center w-full gap-4">
	<div class="flex items-center gap-2">
		<button on:click={() => prev()} class="hovered click">
			<ChevronLeft class="h-7 w-7" />
		</button>

		<div class="min-w-24 relative flex justify-center text-lg font-medium">
			{#if dayjs($monthRange.start).format(monthFormat) !== dayjs($monthRange.end).format(monthFormat)}
				{dayjs($monthRange.start).format(monthFormat)} -
			{/if}

			{dayjs($monthRange.end).format(monthFormat)}

			{#if isPast}
				<div class="-bottom-3 absolute text-xs text-gray-400">
					{dayjs($monthRange.start).format('YYYY')}
				</div>
			{/if}

			{#if dayjs($monthRange.start).format('YYYY') !== dayjs($monthRange.end).format('YYYY')}
				// TODO
				<div class="-bottom-3 absolute text-xs text-gray-400">
					{dayjs($monthRange.start).format('YYYY')}
				</div>
			{/if}
		</div>

		<button
			on:click={() => next()}
			class="{isFuture ? 'cursor-not-allowed text-gray-400' : 'hovered click'} "
			disabled={isFuture}>
			<ChevronRight class="h-7 w-7" />
		</button>
	</div>

	<div use:clickOutside={() => (isExpanded = false)} class="relative">
		<button on:click={clickHandler} class="hovered click flex items-center p-1">
			<Calendar class="h-7 w-7" />
		</button>
		{#if isExpanded}
			<div
				transition:slide
				class="top-8 rounded-xl shadow-small absolute right-0 w-48 p-4 space-y-1 text-sm bg-white">
				<button
					on:click={() => setRange('current_month')}
					class="hover:bg-gray-100 w-full px-2 py-1 text-left rounded-md">
					Current month
				</button>
				<button
					on:click={() => setRange('last_month')}
					class="hover:bg-gray-100 w-full px-2 py-1 text-left rounded-md">
					Last month
				</button>
				<button
					on:click={() => setRange('last_3months')}
					class="hover:bg-gray-100 w-full px-2 py-1 text-left rounded-md">
					Last 3 months
				</button>
				<button
					on:click={() => setRange('current_year')}
					class="hover:bg-gray-100 w-full px-2 py-1 text-left rounded-md">
					Current year
				</button>
				<button
					on:click={() => setRange('current_finance_year')}
					class="hover:bg-gray-100 w-full px-2 py-1 text-left rounded-md">
					Current finance year
				</button>
			</div>
		{/if}
	</div>
</div>
