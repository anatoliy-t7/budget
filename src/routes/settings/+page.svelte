<script>
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import Categories from '$lib/components/settings/categories.svelte';
	import Accounts from '$lib/components/settings/accounts.svelte';
	import Settings from '$lib/components/settings/settings.svelte';
	import Billing from '$lib/components/settings/billing.svelte';
</script>

<svelte:head>
	<title>Settings | {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="flex flex-wrap gap-4">
	<div class="w-full">
		<Billing />
	</div>
	<div class="w-full">
		<Settings />
	</div>

	<div class="w-full max-w-sm">
		<Accounts />
	</div>

	<div class="w-full max-w-sm">
		<Categories />
	</div>
</div>
