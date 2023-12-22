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
			const res = await fetch(
				`http://localhost:8090/api/income?budget=${$authModel?.currentBudget}&startOf=${dayjs($date)
					.startOf('month')
					.toISOString()}&endOf=${dayjs($date).endOf('month').toISOString()}`,
			);

			if (res.status == 200) {
				const data = await res.json();
				income = data.data;
			}
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
