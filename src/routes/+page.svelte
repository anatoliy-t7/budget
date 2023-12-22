<script lang="ts">
	import Income from '$lib/components/overview/income.svelte';
	import RangeCalendar from '$lib/components/ui/range-calendar.svelte';
</script>

<svelte:head>
	<title>Overview</title>
</svelte:head>

<div class="space-y-4">
	<h1>Overview</h1>

	<RangeCalendar />

	<div class="flex flex-wrap gap-6">
		<Income />
	</div>
</div>
