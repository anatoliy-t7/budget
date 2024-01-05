<script lang="ts">
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
		dropdown: {
			maxItems: 10, // <- mixumum allowed rendered suggestions
			classname: 'tags-look', // <- custom classname for this dropdown, so it could be targeted
			enabled: 0, // <- show suggestions on focus
			closeOnSelect: true, // <- do not hide the suggestions dropdown once an item has been selected
		},
	};

	$: if ($tags.length) {
		tagify.whitelist = $tags;
	}

	function onChange(e: any) {
		selected = e.target.value;
	}

	onMount(async () => {
		tagify = new Tagify(input, options);
		if (selected.length) {
			console.log('selected', selected);
			tagify.addTags(selected);
		}
		input.addEventListener('change', onChange);
	});

	onDestroy(() => {
		input.removeEventListener('change', onChange);
	});
</script>

<div>
	<input bind:this={input} />
</div>
