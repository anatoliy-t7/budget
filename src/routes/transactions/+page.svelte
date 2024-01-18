<script>
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import Autocomplete from '$lib/components/ui/autocomplete.svelte';
	import Loader from '$lib/components/ui/loader.svelte';
	import Table from '$lib/components/ui/table.svelte';
	import TransactionType from '$lib/components/ui/transaction-type.svelte';
	import Paginator from '$lib/components/ui/paginator.svelte';
	import TypeToggle from '$lib/components/ui/type-toggle.svelte';
	import Button from '$lib/components/ui/button.svelte';

	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import { alertOnFailure, isMobile, moneyFormat } from '$lib/utils/utils';
	import {
		getTransactions,
		transactions,
		transaction,
		isViewOpen,
		loading,
		transactionType,
		transfer,
		selectedCategory,
		rangeTags,
		filterTag,
		filterCategory,
		monthRange,
		monthIsClosed,
		getTypeClosedTransactions,
	} from '$lib/stores/transactions';
	import { pb } from '$lib/stores/pocketbase';
	import { categories } from '$lib/stores/main';
	import dayjs from 'dayjs';
	import TagsView from '$lib/components/ui/tags-view.svelte';

	$: page = $transactions?.page || 1;

	// stop call api for first time
	let stopIt = false;

	/**
	 * @param {string} value
	 */
	async function changedType(value) {
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

	/**
	 * @param {any} nextPage
	 */
	async function changePage(nextPage) {
		page = nextPage;
		await getTransactions(page);
	}

	/**
	 * @param {{ id: null; amount: null; account: null; type: string; note: null; transfer: null; category: null; ledger: any; user: any; created: string; files: null; tags: never[]; }} item
	 */
	async function onOpenView(item) {
		$transaction = item;

		$selectedCategory = $categories?.find(
			(/** @type {{ id: null; }} */ c) => c.id === $transaction.category,
		);
		$isViewOpen = true;
	}

	/**
	 * @param {string} tag
	 */
	async function filterByTag(tag) {
		$filterTag = $filterTag === tag ? '' : tag;
		await getTransactions(page);
	}

	/**
	 * @param {{ id: string; }} category
	 */
	async function filterByCategory(category) {
		if (stopIt && $filterCategory !== category?.id) {
			$filterCategory = category ? category?.id : '';
			await getTransactions(page);
		}

		stopIt = true;
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
					`${PUBLIC_POCKETBASE_URL}/api/close-month?ledgerId=${pb.authStore.model?.ledger}&startOf=${$monthRange?.start}&endOf=${$monthRange?.end}`,
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

	/**
	 * @param {any} item
	 * @param {any} keywords
	 */
	function categoryFilter(item, keywords) {
		return item;
	}

	onMount(async () => {
		if (!$transactions) {
			await getTransactions(page);
		}
	});
</script>

<svelte:head>
	<title>Transactions | {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-4">
		<div class="flex flex-wrap items-center gap-4">
			<div class="w-[320px]">
				<TypeToggle on:changed={(event) => changedType(event.detail)} />
			</div>

			<div>
				{#if $categories}
					<Autocomplete
						items={$categories}
						onChange={(value) => filterByCategory(value)}
						itemFilterFunction={categoryFilter}
						labelFieldName="name"
						valueFieldName="id"
						matchAllKeywords={false}
						sortByMatchedKeywords={true}
						keywordsFieldName="name"
						dropdownClassName="w-full"
						placeholder="Filter by category"
						showClear={true} />
				{/if}
			</div>
		</div>

		<div class="flex w-full justify-end sm:w-48">
			{#if !$monthIsClosed && dayjs($monthRange.start).isSame($monthRange.end, 'month')}
				<Button
					loading={$loading}
					on:click={onCloseMonth}
					size={isMobile() ? 'xs' : 'md'}
					color={'outline-green'}
					class="click">
					Close {dayjs($monthRange.start).format('MMMM')}
				</Button>
			{/if}
		</div>
	</div>

	{#if $rangeTags.length > 0}
		<div class="flex items-center gap-2 text-sm font-medium">
			<div class="text-gray-500">Tags:</div>
			{#each $rangeTags as tag}
				<button
					on:click={() => filterByTag(tag)}
					class="{$filterTag === tag
						? 'bg-amber-200'
						: 'bg-white hover:bg-gray-200'} click rounded-full px-3 py-1">
					{tag?.replace('#', '')}
				</button>
			{/each}
		</div>
	{/if}

	<div class="rounded-xl bg-white p-6">
		{#if $loading}
			<Loader />
		{:else}
			<Table>
				<svelte:fragment slot="head">
					<th> Date </th>
					<th> Type </th>
					<th class="text-right"> Amount </th>
					<th> Account </th>
					<th> Category </th>
					<th> Tags </th>
					<th> Files </th>
					<th> Note </th>
				</svelte:fragment>
				<svelte:fragment slot="body">
					{#if $transactions?.items?.length > 0}
						{#each $transactions?.items?.filter((t) => t.type !== 'closed') as item}
							<tr on:click={() => onOpenView(item)} class="cursor-pointer">
								<td>
									{dayjs(item?.created).format('D MMM YYYY')}
								</td>
								<td>
									<TransactionType type={item?.type} />
								</td>
								<td class="text-right">
									{moneyFormat(item.amount, item.expand?.account?.currency)}
								</td>
								<td>{item?.expand?.account?.name}</td>
								<td>
									<div class="flex items-center gap-2">
										<div class="text-lg">{@html item?.expand?.category?.icon || ''}</div>
										<div>{item?.expand?.category?.name}</div>
									</div>
								</td>
								<td>
									<TagsView tags={item?.tags} />
								</td>
								<td>{item?.expand?.files?.files?.length || ''}</td>
								<td>
									<div class="w-full max-w-52 truncate">
										{item.note}
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</svelte:fragment>
			</Table>

			{#if $transactions?.items?.length}
				<Paginator data={$transactions} on:onPageChange={(event) => changePage(event.detail)} />
			{/if}
		{/if}
	</div>
</div>
