<script>
	import {
		getOverview,
		accounts,
		categories,
		overview,
		getAccounts,
		getCategories,
	} from '$lib/stores/transactions';
	import { authModel } from '$lib/stores/pocketbase';
	import { onMount } from 'svelte';

	onMount(async () => {
		if (!$overview) {
			getOverview($authModel?.currentBudget);
		}
		if (!$accounts) {
			getAccounts();
		}
		if (!$categories) {
			getCategories();
		}
	});
</script>
