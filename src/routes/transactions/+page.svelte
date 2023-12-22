<script lang="ts">
	import { onMount } from 'svelte';
	import { alertOnFailure } from '$lib/utils';
	import { client } from '$lib/pocketbase';
	import { loading } from '$lib/stores/transactions';
	import type { ListResult, RecordModel } from 'pocketbase';
	import dayjs from 'dayjs';

	import Loader from '$lib/components/ui/loader.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Paginator from '$lib/components/ui/paginator.svelte';

	const tableHead = ['Date', 'Type', 'Amount', 'Account', 'Category', 'User', ''];

	const coll = client.collection('transactions');
	let transactions: ListResult<RecordModel>;
	$: page = transactions?.page || 1;

	async function loadData() {
		$loading = true;

		await alertOnFailure(async () => {
			transactions = await coll.getList(page, 10, {
				sort: '-created',
				expand: 'category,account,user',
				fields:
					'created,amount,type,note,transfer,expand.category.name,expand.account.name,expand.account.currency,expand.user.email',
			});
		});

		$loading = false;
	}

	async function changePage(nextPage: any) {
		page = nextPage;
		await loadData();
	}

	onMount(async () => {
		await loadData();
	});

	$: console.log(transactions);
</script>

<svelte:head>
	<title>Transactions</title>
</svelte:head>

<div class="space-y-4">
	<h1>Transactions</h1>

	<div class="rounded-xl shadow-small p-6 bg-white">
		{#if transactions?.items?.length}
			<Table head={tableHead}>
				{#each transactions.items as transaction}
					<tr>
						<td>
							{dayjs(transaction.created).format('D MMM YYYY')}
						</td>
						<td class="capitalize">
							{transaction.type}
						</td>
						<td>
							{transaction.expand?.account.currency}
							{transaction.amount}
						</td>
						<td>{transaction.expand?.account.name}</td>
						<td>{transaction.expand?.category.name}</td>
						<td>{transaction.expand?.user.email}</td>
						<td>
							<div class="flex items-center justify-end gap-2"></div>
						</td>
					</tr>
				{/each}
			</Table>

			<Paginator data={transactions} on:onPageChange={(event) => changePage(event.detail)} />
		{:else}
			<Loader />
		{/if}
	</div>
</div>
