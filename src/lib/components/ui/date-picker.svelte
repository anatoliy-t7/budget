<script lang="ts">
	import Calendar from '~icons/solar/calendar-linear';

	import { onDestroy, onMount } from 'svelte';
	import { easepick, RangePlugin, LockPlugin } from '@easepick/bundle';

	export let range: boolean = false;
	export let value: Date | string = new Date();

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
			date: value!,
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

<div class="relative cursor-pointer">
	<input bind:this="{datepicker}" class="text-base" />
	<button on:click="{() => picker.show()}" type="button" class="absolute right-3 top-2">
		<Calendar class="h-7 w-7" />
	</button>
</div>
