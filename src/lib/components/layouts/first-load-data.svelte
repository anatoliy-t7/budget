<script>
	import { onMount } from 'svelte';

	import { preparePageTransition } from '$lib/utils/utils';
	import {
		accounts,
		categories,
		getAccounts,
		getCategories,
		billingPortalUrl,
		getBillingPortalUrl,
	} from '$lib/stores/main';
	import { getOverview, overview, getTransactions } from '$lib/stores/transactions';
	import { pb, authModel } from '$lib/stores/pocketbase';

	preparePageTransition();

	const collTransactions = pb.collection('transactions');

	$: if ($authModel) {
		collTransactions.subscribe(
			'*',
			async function (e) {
				await getOverview();
				await getTransactions();
			},
			{
				filter: `ledger = "${$authModel?.ledger}" && type != "closed" && type != "opened"`,
			},
		);
	} else {
		collTransactions.unsubscribe();
	}

	onMount(async () => {
		if (!$overview) {
			await getOverview();
		}
		if (!$accounts) {
			await getAccounts();
		}
		if (!$categories) {
			await getCategories();
		}
		if (!$billingPortalUrl) {
			await getBillingPortalUrl();
		}
	});
</script>

<!-- {#await import('$lib/components/layouts/reload-prompt.svelte') then { default: ReloadPrompt }}
	<ReloadPrompt />
{/await} -->
