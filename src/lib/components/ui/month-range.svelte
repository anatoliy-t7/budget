<script>
	import { clickOutside } from '$lib/utils';
	import dayjs from 'dayjs';
	import { slide } from 'svelte/transition';
	import Calendar from '~icons/solar/calendar-linear';
	import ChevronLeft from '~icons/solar/round-alt-arrow-left-linear';
	import ChevronRight from '~icons/solar/round-alt-arrow-right-linear';

	let isExpanded = false;

	let selected = {
		start: null,
		end: dayjs(),
	};

	function clickHandler() {
		isExpanded = !isExpanded;
	}

	function prev() {
		selected.end = dayjs(selected.end).subtract(1, 'M');
	}

	function next() {
		selected.end = dayjs(selected.end).add(1, 'M');
	}

	$: isFuture = dayjs(dayjs(selected.end).add(1, 'M')).isAfter(dayjs(), 'month');
</script>

<div class="flex items-center gap-6">
	<div class="flex items-center gap-4">
		<button on:click={() => prev()} class="hover">
			<ChevronLeft class="w-6 h-6" />
		</button>

		<div class="flex justify-center w-24 text-lg font-medium">
			{dayjs(selected.end).format('MMMM')}
		</div>

		<button
			on:click={() => next()}
			class="{isFuture ? 'text-gray-400 cursor-not-allowed' : 'hover'} "
			disabled={isFuture}
		>
			<ChevronRight class="w-6 h-6" />
		</button>
	</div>

	<div use:clickOutside={() => (isExpanded = false)} class="relative">
		<button on:click={clickHandler} class="hover flex items-center p-1"
			><Calendar class="w-6 h-6" /></button
		>
		{#if isExpanded}
			<div
				transition:slide
				class="top-8 shadow-small rounded-xl absolute left-0 w-40 p-4 space-y-1 text-sm bg-white"
			>
				<button class="hover:bg-gray-100 w-full px-2 py-1 text-left">Current month</button>
				<button class="hover:bg-gray-100 w-full px-2 py-1 text-left">Previous month</button>
				<button class="hover:bg-gray-100 w-full px-2 py-1 text-left">Current quarter</button>
				<button class="hover:bg-gray-100 w-full px-2 py-1 text-left">Previous quarter</button>
				<button class="hover:bg-gray-100 w-full px-2 py-1 text-left">Current year</button>
			</div>
		{/if}
	</div>
</div>
