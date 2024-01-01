<script lang="ts">
	import { onMount } from 'svelte';

	import { preparePageTransition } from '$lib/utils';
	import { accounts, categories, getAccounts, getCategories } from '$lib/stores/main';
	import { getOverview, overview, getTransactions } from '$lib/stores/transactions';
	import { pb, authModel } from '$lib/stores/pocketbase';

	preparePageTransition();

	const coll = pb.collection('transactions');

	$: if ($authModel) {
		coll.subscribe(
			'*',
			async function (e) {
				await getOverview();
				await getTransactions();
			},
			{
				filter: "type != 'closed' && type != 'opened'",
			},
		);
	} else {
		coll.unsubscribe();
	}

	onMount(async () => {
		if (!$overview) {
			getOverview();
		}
		if (!$accounts) {
			getAccounts();
		}
		if (!$categories) {
			getCategories();
		}
	});
</script>

{#await import('$lib/components/layouts/reload-prompt.svelte') then { default: ReloadPrompt }}
	<ReloadPrompt />
{/await}
