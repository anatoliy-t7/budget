<script>
	// https://github.com/yairEO/tagify
	import Tagify from '@yaireo/tagify';
	import '@yaireo/tagify/dist/tagify.css';
	import { onDestroy, onMount } from 'svelte';
	import { tags } from '$lib/stores/transactions';

	/**
	 * @type {string | any[]}
	 */
	export let selected = [];
	/**
	 * @type {{ whitelist: string | any[]; addTags: (arg0: string | any[]) => void; } | null}
	 */
	let tagify = null;
	/**
	 * @type {HTMLInputElement}
	 */
	let input;
	let options = {
		whitelist: [],
		originalInputValueFormat: (/** @type {any[]} */ valuesArr) =>
			valuesArr.map((item) => item.value).join(','),
		maxTags: 10,
		placeholder: 'Type and press enter',
		dropdown: {
			maxItems: 10, // <- mixumum allowed rendered suggestions
			classname: 'tags-dropdown', // <- custom classname for this dropdown, so it could be targeted
			enabled: 0, // <- show suggestions on focus
			closeOnSelect: true, // <- do not hide the suggestions dropdown once an item has been selected
			position: 'text',
		},
	};

	$: if ($tags.length && tagify && !tagify?.whitelist?.length) {
		tagify.whitelist = $tags;
	}

	/**
	 * @param {{ target: { value: string | any[]; }; }} e
	 */
	function onChange(e) {
		selected = e.target.value;
	}

	onMount(async () => {
		tagify = new Tagify(input, options);
		if (selected.length) {
			tagify.addTags(selected);
		}

		input.addEventListener('change', onChange);
	});

	onDestroy(() => {
		input.removeEventListener('change', onChange);
		tagify = null;
	});
</script>

<div class="flex items-center gap-2">
	<input bind:this={input} class="tagifyTheme" />
</div>
