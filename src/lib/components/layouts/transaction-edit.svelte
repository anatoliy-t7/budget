<script>
	import Drawer from '$lib/components/ui/drawer.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import TypeSwitch from '$lib/components/ui/type-switch.svelte';
	import ListboxAccount from '$lib/components/ui/listbox-account.svelte';
	import DatePicker from '$lib/components/ui/date-picker.svelte';
	import Autocomplete from '$lib/components/ui/autocomplete.svelte';
	import FileUploader from '$lib/components/ui/file-uploader.svelte';
	import Tags from '$lib/components/ui/tags.svelte';

	import toast from 'svelte-french-toast';
	import dayjs from 'dayjs';
	import { alertOnFailure } from '$lib/utils/utils';
	import { pb } from '$lib/stores/pocketbase';
	import { categories, accounts, loading } from '$lib/stores/main';
	import {
		isEditOpen,
		transaction,
		selectedCategory,
		reset,
		historyTransaction,
	} from '$lib/stores/transactions';
	import { onMount } from 'svelte';

	const coll = pb.collection('transactions');

	/**
	 * @type {null | number}
	 */
	let transferAmount = null;
	let disabledCategory = false;

	$: disabled = !$transaction?.amount || !$transaction?.category;

	$: transactionAccount = null;

	$: transferAccount = null;

	/**
	 * @param {string} type
	 */
	async function changedType(type) {
		if ($transaction.type !== 'transfer') {
			$transaction.transfer = $accounts?.length > 1 ? $accounts[1]?.id : $accounts[0]?.id;
		} else {
			$transaction.transfer = null;
		}
		$transaction.type = type;

		if ($transaction.type === 'transfer') {
			$selectedCategory = $categories?.find(
				(/** @type {{ id: string; }} */ c) => c.id == 'catego_transfer',
			);
			disabledCategory = true;
		} else {
			$selectedCategory = null;
			disabledCategory = false;
		}
	}

	async function submit() {
		$loading = true;

		if ($transaction.id) {
			alertOnFailure(async () => {
				await coll.update($transaction.id, $transaction);
				toast.success(`${$transaction.type} was updated`);

				$loading = false;
				await close();
			});
		} else {
			alertOnFailure(async () => {
				$transaction.created = dayjs($transaction.created)
					.set('hour', dayjs().get('hour'))
					.set('minute', dayjs().get('minute'))
					.set('second', dayjs().get('second'))
					.toISOString();

				if ($transaction.type !== 'transfer') {
					$transaction.transfer = null;
				}

				if ($transaction.type === 'transfer') {
					$transaction.type = 'expenses';

					await coll.create($transaction);
					toast.success(`${$transaction.type} was added`);

					$transaction.type = 'income';
					const fromAccount = $transaction.transfer;
					$transaction.transfer = $transaction.account;
					$transaction.account = fromAccount;

					if (transactionAccount?.currency != transferAccount?.currency) {
						$transaction.amount = transferAmount;
					}
				}

				await coll.create($transaction);

				toast.success(`${$transaction.type} was added`);

				$loading = false;
				await close();
			});
		}
	}

	async function onClose() {
		if (
			$historyTransaction !== JSON.stringify($transaction) &&
			!confirm(`Do you want to close it?`)
		) {
			return;
		} else {
			await close();
		}
	}

	async function close() {
		$isEditOpen = false;
		transferAmount = null;

		await reset();
	}

	/**
	 * @param {{ type: string; }} item
	 * @param {any} keywords
	 */
	function categoryFilter(item, keywords) {
		if ($transaction.type === 'expenses') {
			return item.type === 'expenses';
		}

		if ($transaction.type === 'income') {
			return item.type === 'income';
		}
		if ($transaction.type === 'transfer') {
			return item.type === 'transfer';
		}
	}

	onMount(() => {
		transactionAccount = $accounts?.find((a) => a.id == $transaction?.account);
		transferAccount = $accounts?.find((a) => a.id == $transaction?.transfer);
	});
</script>

<Drawer bind:open={$isEditOpen} on:close={() => onClose()}>
	<div class="pb-6 text-2xl font-medium">Add transaction</div>

	<form on:submit|preventDefault={submit} class="grid max-w-sm gap-4">
		<div>
			<DatePicker bind:value={$transaction.created} />
		</div>

		<TypeSwitch selected={$transaction.type} on:changed={(event) => changedType(event.detail)} />

		<div class="flex gap-6">
			<div class="block w-full space-y-1 font-medium">
				<div class="text-sm">
					{#if $transaction.type === 'transfer'}
						From
					{:else}
						Account
					{/if}
				</div>
				<ListboxAccount bind:value={$transaction.account} />
			</div>

			{#if $transaction.type === 'transfer'}
				<div class="block w-full space-y-1 font-medium">
					<div class="text-sm">To</div>

					<ListboxAccount bind:value={$transaction.transfer} class="right-0" />
				</div>
			{/if}
		</div>

		<div class="flex gap-6">
			<div class="block w-full space-y-1 font-medium">
				<span class="text-sm">
					{#if $transaction.type === 'transfer' && transactionAccount?.currency !== transferAccount?.currency}
						Sent amount
					{:else}
						Amount
					{/if}
				</span>

				<div class="relative">
					<input bind:value={$transaction.amount} required type="number" placeholder="100" />
					{#if transactionAccount}
						<div class="absolute right-3 top-3 text-gray-400">
							{transactionAccount?.currency}
						</div>
					{/if}
				</div>
			</div>
			{#if $transaction.type === 'transfer' && transactionAccount?.currency !== transferAccount?.currency}
				<div class="block w-full space-y-1 font-medium">
					<span class="text-sm"> Got amount </span>
					<div class="relative">
						<input bind:value={transferAmount} type="number" placeholder="100" />
						{#if transferAccount}
							<div class="absolute right-3 top-3 text-gray-400">
								{transferAccount?.currency}
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<div class="space-y-1 font-medium">
			<div class="text-sm">Category</div>

			<Autocomplete
				items={$categories}
				bind:value={$transaction.category}
				selectedItem={$selectedCategory}
				itemFilterFunction={categoryFilter}
				labelFieldName="name"
				valueFieldName="id"
				matchAllKeywords={false}
				sortByMatchedKeywords={true}
				keywordsFieldName="name"
				disabled={disabledCategory}
				required={true} />
		</div>

		<div class="space-y-1 font-medium">
			<div class="text-sm">
				Tags <span class="font-normal text-gray-400">(optional)</span>
			</div>

			{#if $isEditOpen}
				<Tags bind:selected={$transaction.tags} />
			{/if}
		</div>

		<div class="w-full space-y-1 font-medium">
			<span class="text-sm"> Note <span class="font-normal text-gray-400">(optional)</span> </span>
			<div class="">
				<input bind:value={$transaction.note} type="text" />
			</div>
		</div>

		<div class="w-full space-y-1 font-medium">
			<span class="text-sm">
				Files <span class="font-normal text-gray-400">(optional) max 5</span></span>
			<FileUploader bind:id={$transaction.files} />
		</div>

		<div class="pt-4">
			<Button loading={$loading} disabled={disabled} type="submit" class="w-full">
				{$transaction.id ? 'Update' : 'Add'}
			</Button>
		</div>
	</form>
</Drawer>
