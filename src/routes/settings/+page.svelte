<script>
	import Categories from '$lib/components/settings/categories.svelte';

	import Accounts from '$lib/components/settings/accounts.svelte';
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<div class="flex flex-wrap gap-4">
	<Categories />

	<Accounts />
</div>
