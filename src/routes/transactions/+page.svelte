<script lang="ts">
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import {
		getTransactions,
		transactions,
		transaction,
		drawerIsOpen,
		loading,
		transactionType,
		transfer,
		selectedCategory,
		tags,
		filterTag,
		monthRange,
		monthIsClosed,
		getTypeClosedTransactions,
	} from '$lib/stores/transactions';
	import { pb } from '$lib/stores/pocketbase';
	import { categories } from '$lib/stores/main';
	import dayjs from 'dayjs';

	import Trash from '~icons/solar/trash-bin-minimalistic-linear';
	import Pencil from '~icons/tabler/pencil';
	import Loader from '$lib/components/ui/loader.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import TransactionType from '$lib/components/ui/transaction-type.svelte';
	import Paginator from '$lib/components/ui/paginator.svelte';
	import TypeToggle from '$lib/components/ui/type-toggle.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { alertOnFailure } from '$lib/utils';

	const tableHead = ['Date', 'Type', 'Amount', 'Account', 'Category', 'User', 'Note', ''];
	const coll = pb.collection('transactions');

	$: page = $transactions?.page || 1;

	async function changedType(value: string) {
		if (!value) {
			$transfer = '~';
		}

		if (value === 'transfer') {
			$transfer = '!=';
			value = '';
		}

		if (value === 'expenses' || value === 'income') {
			$transfer = '=';
		}

		$transactionType = value;

		page = 1;

		await getTransactions(page);
	}

	async function changePage(nextPage: any) {
		page = nextPage;
		await getTransactions(page);
	}

	async function onOpenEdit(item: any) {
		$transaction = {
			id: item.id,
			amount: item.amount,
			account: item.account,
			type: item.type,
			note: item.note,
			transfer: item.transfer,
			category: item.category,
			budget: item.budget,
			user: item.user,
			created: item.created,
		};

		$selectedCategory = $categories?.find((c) => c.id === $transaction.category);
		$drawerIsOpen = true;
	}

	async function onDelete(item: any) {
		if (confirm(`Do you confirm to delete the "${item.type}" transaction?`)) {
			$loading = true;
			await coll.delete(item.id);
			toast.success(`${item.type} was deleted`);

			$loading = false;
		}
	}

	async function filterByTag(tag: string) {
		$filterTag = $filterTag === tag ? '' : tag;
		await getTransactions(page);
	}

	async function onCloseMonth() {
		if (
			confirm(
				`Do you confirm to close ${dayjs($monthRange.start).format(
					'MMMM',
				)} month? \nYou can't edit transactions of the month.`,
			)
		) {
			$loading = true;

			await alertOnFailure(async () => {
				const res = await fetch(
					`${PUBLIC_POCKETBASE_URL}/api/close-month?budgetId=${pb.authStore.model?.currentBudget}&startOf=${$monthRange?.start}&endOf=${$monthRange?.end}`,
					{
						headers: {
							Authorization: pb.authStore.token,
						},
					},
				);

				if (res.status == 200) {
					toast.success(`${dayjs($monthRange.start).format('MMMM')} was closed`);
				} else {
					toast.error(`${dayjs($monthRange.start).format('MMMM')} was NOT closed`);
				}

				await getTypeClosedTransactions();

				$loading = false;
			});
		}
	}

	onMount(async () => {
		await getTransactions(page);
	});
</script>

<svelte:head>
	<title>Transactions</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex justify-between gap-6">
		<div class="flex gap-4">
			<TypeToggle on:changed={(event) => changedType(event.detail)} />
		</div>

		{#if !$monthIsClosed && dayjs($monthRange.start).isSame($monthRange.end, 'month')}
			<Button loading={$loading} on:click={onCloseMonth} color={'outline-green'} class="click">
				Close {dayjs($monthRange.start).format('MMMM')}
			</Button>
		{/if}
	</div>

	{#if $tags.length > 0}
		<div class="flex items-center gap-2 text-sm font-medium">
			<div class="text-gray-500">Tags:</div>
			{#each $tags as tag}
				<button
					on:click={() => filterByTag(tag)}
					class="{$filterTag === tag
						? 'bg-amber-400'
						: 'bg-white hover:bg-gray-200'} rounded-full px-3 py-1">
					{tag?.replace('#', '')}
				</button>
			{/each}
		</div>
	{/if}

	<div class="rounded-xl bg-white p-6">
		{#if $loading}
			<Loader />
		{:else}
			<Table head={tableHead}>
				{#if $transactions?.items?.length > 0}
					{#each $transactions?.items?.filter((t) => t.type !== 'closed') as item}
						<tr class="group">
							<td>
								{dayjs(item?.created).format('D MMM YYYY')}
							</td>
							<td>
								<TransactionType type={item?.type} />
							</td>
							<td>
								{item?.expand?.account?.currency}
								{item?.amount}
							</td>
							<td>{item?.expand?.account?.name}</td>
							<td>{item?.expand?.category?.name}</td>
							<td>{item?.expand?.user?.email}</td>
							<td>
								<div class="w-full max-w-52 truncate">
									{item.note}
								</div>
							</td>
							<td class="w-32">
								<div class="hidden w-full items-center justify-end gap-2 group-hover:flex">
									{#if !$monthIsClosed}
										<button on:click={() => onOpenEdit(item)} class="click hover:text-sky-500">
											<Pencil class="h-6 w-6" />
										</button>
									{/if}

									<button
										disabled={$loading}
										on:click={() => onDelete(item)}
										class="click hover text-red-500 disabled:cursor-not-allowed disabled:opacity-50">
										<Trash class=" h-6 w-6" />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</Table>

			{#if $transactions?.items?.length}
				<Paginator data={$transactions} on:onPageChange={(event) => changePage(event.detail)} />
			{/if}
		{/if}
	</div>
</div>
