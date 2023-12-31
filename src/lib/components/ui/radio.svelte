<script lang="ts">
	export let options: any = [];
	export let selected: any;
	export let disabled = false;
	export let required = false;

	const slugify = (str = '') => str.toLowerCase().replace(/ /g, '-').replace(/\./g, '');
</script>

<div class="flex items-center gap-4">
	{#each options as { value, label }}
		<div class="flex items-center gap-2">
			<input
				type="radio"
				id={slugify(label)}
				bind:group={selected}
				value={value}
				disabled={disabled}
				required={required}
				class="h-5 w-5 shrink-0 cursor-pointer rounded-full border-gray-300 text-amber-600 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50" />
			<label for={slugify(label)} class="cursor-pointer">
				{label}
			</label>
		</div>
	{/each}
</div>
