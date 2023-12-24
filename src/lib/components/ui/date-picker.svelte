<script lang="ts">
	import ChevronLeft from '~icons/solar/round-alt-arrow-left-linear';
	import ChevronRight from '~icons/solar/round-alt-arrow-right-linear';
	import Calendar from '~icons/solar/calendar-linear';
	import { fade } from 'svelte/transition';

	import { onDestroy, onMount } from 'svelte';
	import { easepick, RangePlugin } from '@easepick/bundle';

	let datepicker: HTMLDivElement;
	let picker: easepick.Core;

	const today = new Date();
	let selectedDate: Date | null = today;

	onMount(() => {
		// https://easepick.com/
		picker = new easepick.create({
			element: datepicker,
			css: [
				'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css',
				'https://cdn.jsdelivr.net/npm/@easepick/lock-plugin@1.2.1/dist/index.css',
				//Set custom css
				//'/css/calendar.css'
			],
			zIndex: 10,
			plugins: [RangePlugin],
			date: selectedDate!,
		});

		picker.on('select', (e) => {
			selectedDate = e.detail.date;
			console.log(`Select ${e.detail.start}  ${e.detail.end}`);
		});

		picker.on('change', () => {
			console.log(picker.getStartDate());
			console.log(picker.getEndDate());
		});

		picker.on('clear', () => {
			selectedDate = null;
		});
	});

	onDestroy(() => {
		if (picker) {
			picker.off('select', () => {});
			picker.off('clear', () => {});
		}
	});
</script>

<div class=" relative w-6 h-6">
	<input bind:this={datepicker} class=" absolute inset-0 w-6 h-6 opacity-0 cursor-pointer" />
	<Calendar />
</div>
