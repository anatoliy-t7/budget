<script lang="ts">
	import MonthRange from '$lib/components/ui/month-range.svelte';

	import { onMount } from 'svelte';
	import { alertOnFailure } from '$lib/utils';
	import { client, authModel } from '$lib/pocketbase';
	import { loading } from '$lib/stores/transactions';
	import { date } from '$lib/stores/main';
	import dayjs from 'dayjs';

	import Loader from '$lib/components/ui/loader.svelte';

	let selected;

	const coll = client.collection('transactions');
	let data: number = 0;

	async function loadData() {
		$loading = true;

		await alertOnFailure(async () => {
			const res = await fetch(
				`http://localhost:8090/api/overview?budget=${$authModel?.currentBudget}&startOf=${dayjs(
					$date,
				)
					.startOf('month')
					.toISOString()}&endOf=${dayjs($date).endOf('month').toISOString()}`,
			);

			if (res.status == 200) {
				data = await res.json();
			}
		});

		$loading = false;
	}

	onMount(async () => {
		await loadData();
	});
</script>

<svelte:head>
	<title>Overview</title>
</svelte:head>

<div class="space-y-4">
	<h1>Overview</h1>

	<MonthRange />

	<div class="flex flex-wrap gap-6">
		<div class="rounded-xl shadow-small p-6 bg-white">
			Income

			<div>{data.income}</div>
		</div>
		<div class="rounded-xl shadow-small p-6 bg-white">
			Expences

			<div>{data.expences}</div>
		</div>
	</div>
</div>
