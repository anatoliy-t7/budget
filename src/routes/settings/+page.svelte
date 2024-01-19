<script>
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import Categories from '$lib/components/settings/categories.svelte';
	import Accounts from '$lib/components/settings/accounts.svelte';
	import Settings from '$lib/components/settings/settings.svelte';
</script>

<svelte:head>
	<title>Settings | {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="md:grid-cols-12 grid gap-4">
	<div class="md:col-span-6">
		<Settings />
	</div>

	<div class="md:col-span-3">
		<Accounts />
	</div>

	<div class="md:col-span-3">
		<Categories />
	</div>
</div>
