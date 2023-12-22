<script lang="ts">
	import { onMount } from 'svelte';
	import { alertOnFailure } from '$lib/utils';
	import { client, authModel } from '$lib/pocketbase';
	import { loading } from '$lib/stores/transactions';
	import { date } from '$lib/stores/main';
	import dayjs from 'dayjs';

	import Loader from '$lib/components/ui/loader.svelte';

	const coll = client.collection('transactions');
	let income: number = 0;

	async function loadData() {
		$loading = true;

		await alertOnFailure(async () => {
			const res = await coll.getFullList({
				filter: `budget = "${$authModel?.currentBudget}" && created >= "${dayjs($date)
					.startOf('month')
					.toISOString()}" &&
                    created <= "${dayjs($date).endOf('month').toISOString()}" &&
                    type = "income"`,
				fields: 'amount',
			});

			income = res?.reduce((total, item) => total + item.amount, 0);
		});

		$loading = false;
	}

	onMount(async () => {
		await loadData();
	});
</script>

<div class="rounded-xl shadow-small p-6 bg-white">
	Income

	<div>{income}</div>
</div>
