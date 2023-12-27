<script lang="ts">
	import { onMount } from 'svelte';
	import { getTransactions, transactions, loading } from '$lib/stores/transactions';
	import dayjs from 'dayjs';

	import Loader from '$lib/components/ui/loader.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import Paginator from '$lib/components/ui/paginator.svelte';
	import TypeToggle from '$lib/components/ui/type-toggle.svelte';

	const tableHead = ['Date', 'Type', 'Amount', 'Account', 'Category', 'User', ''];

	$: page = $transactions?.page || 1;

	let type: string = '';
	let transfer: string = '~';

	async function changedType(value: string) {
		if (!value) {
			transfer = '~';
		}

		if (value === 'transfer') {
			transfer = '!=';
			value = '';
		}

		if (value === 'expenses' || value === 'income') {
			transfer = '=';
		}

		type = value;
		page = 1;

		await getTransactions(page, value, transfer);
	}

	async function changePage(nextPage: any) {
		page = nextPage;
		await getTransactions(page, type, transfer);
	}

	onMount(async () => {
		await getTransactions(page, type);
	});
</script>

<svelte:head>
	<title>Transactions</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex gap-4">
		<TypeToggle on:changed="{(event) => changedType(event.detail)}" />
	</div>

	<div class="rounded-xl bg-white p-6">
		{#if $loading == true}
			<Loader />
		{:else}
			<Table head="{tableHead}">
				{#if $transactions?.items?.length}
					{#each $transactions?.items as transaction}
						<tr>
							<td>
								{dayjs(transaction?.created).format('D MMM YYYY')}
							</td>
							<td class="capitalize">
								{transaction?.type}
							</td>
							<td>
								{transaction?.expand?.account?.currency}
								{transaction?.amount}
							</td>
							<td>{transaction?.expand?.account?.name}</td>
							<td>{transaction?.expand?.category?.name}</td>
							<td>{transaction?.expand?.user?.email}</td>
							<td>
								<div class="flex items-center justify-end gap-2"></div>
							</td>
						</tr>
					{/each}
				{/if}
			</Table>

			{#if $transactions?.items?.length}
				<Paginator data="{$transactions}" on:onPageChange="{(event) => changePage(event.detail)}" />
			{/if}
		{/if}
	</div>
</div>
