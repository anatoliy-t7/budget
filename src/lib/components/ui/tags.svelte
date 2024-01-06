<script lang="ts">
	// https://github.com/yairEO/tagify
	import Tagify from '@yaireo/tagify';
	import '@yaireo/tagify/dist/tagify.css';
	import { onDestroy, onMount } from 'svelte';
	import { tags } from '$lib/stores/transactions';

	export let selected: any = [];
	let tagify: any = null;
	let input: any;
	let options = {
		whitelist: [],
		originalInputValueFormat: (valuesArr: any) =>
			valuesArr.map((item: any) => item.value).join(','),
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

	function onChange(e: any) {
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
