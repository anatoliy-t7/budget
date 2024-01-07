<script>
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import Categories from '$lib/components/settings/categories.svelte';
	import Accounts from '$lib/components/settings/accounts.svelte';
	import Settings from '$lib/components/settings/settings.svelte';
</script>

<svelte:head>
	<title>Settings | {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="flex flex-wrap gap-4">
	<div class="w-full">
		<Settings />
	</div>

	<Accounts />

	<Categories />
</div>
