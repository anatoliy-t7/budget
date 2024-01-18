<script lang="ts">
	import Calendar from '~icons/solar/calendar-linear';
	import dayjs from 'dayjs';
	import { onDestroy, onMount } from 'svelte';
	import { easepick, RangePlugin, LockPlugin } from '@easepick/bundle';

	export let range: boolean = false;
	export let value: Date | string | null = new Date();

	let datepicker: HTMLDivElement;
	let picker: easepick.Core;

	onMount(() => {
		// https://easepick.com/
		picker = new easepick.create({
			element: datepicker,
			css: [
				'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css',
				'https://cdn.jsdelivr.net/npm/@easepick/lock-plugin@1.2.1/dist/index.css',
			],
			format: 'D MMM YYYY',
			zIndex: 10,
			plugins: range ? [RangePlugin, LockPlugin] : [LockPlugin],
			date: dayjs(value).toDate(),
			LockPlugin: {
				maxDate: new Date(),
			},
		});

		picker.on('select', (e) => {
			value = e.detail.date;
			// console.log(`Select ${e.detail.start}  ${e.detail.end}`);
		});

		picker.on('clear', () => {
			value = null;
		});
	});

	onDestroy(() => {
		if (picker) {
			picker.off('select', () => {});
			picker.off('clear', () => {});
		}
	});
</script>

<div class="flex items-center gap-4 cursor-pointer">
	<input
		bind:this={datepicker}
		class="w-28 focus:outline-none text-lg font-medium bg-transparent" />

	<button on:click={() => picker.show()} type="button" class="click">
		<Calendar class="h-7 w-7" />
	</button>
</div>
