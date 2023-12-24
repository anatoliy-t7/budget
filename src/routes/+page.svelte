<script lang="ts">
	import MonthRange from '$lib/components/ui/month-range.svelte';
	import Stat from '$lib/components/overview/stat.svelte';
</script>

<svelte:head>
	<title>Overview</title>
</svelte:head>

<div class="space-y-6">
	<h1>Overview</h1>

	<div class="space-y-2">
		<MonthRange />

		<Stat />
	</div>
</div>
