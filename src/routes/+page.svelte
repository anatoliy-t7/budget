<script>
	import Stat from '$lib/components/overview/stat.svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import Categories from '$lib/components/overview/categories.svelte';
	import { hasAccess } from '$lib/utils/utils';
</script>

<svelte:head>
	<title>Overview | {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="space-y-6">
	<div class="space-y-4">
		<Stat />

		<Categories />
	</div>
</div>
