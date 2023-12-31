<script lang="ts">
	import Drawer from '$lib/components/ui/drawer.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import TypeSwitch from '$lib/components/ui/type-switch.svelte';
	import ListboxAccount from '$lib/components/ui/listbox-account.svelte';
	import DatePicker from '$lib/components/ui/date-picker.svelte';
	import Autocomplete from '$lib/components/ui/autocomplete.svelte';
	import Plus from '~icons/tabler/plus';

	import dayjs from 'dayjs';
	import { alertOnFailure } from '$lib/utils';
	import { pb } from '$lib/stores/pocketbase';
	import { categories, accounts, loading } from '$lib/stores/main';
	import { drawerIsOpen, transaction, selectedCategory } from '$lib/stores/transactions';
	import toast from 'svelte-french-toast';

	const coll = pb.collection('transactions');

	let transferAmount: number | null = null;
	let disabledCategory = false;

	$: disabled = !$transaction?.amount;

	$: transactionAccount = $accounts?.find((a) => a.id == $transaction?.account);

	$: transferAccount = $accounts?.find((a) => a.id == $transaction?.transfer);

	async function changedType(type: string) {
		if ($transaction.type !== 'transfer') {
			$transaction.transfer = $accounts[1].id;
		} else {
			$transaction.transfer = null;
		}
		$transaction.type = type;

		if ($transaction.type === 'transfer') {
			$selectedCategory = $categories?.find((c) => c.id == '1o2o1fdok8m1ek9');
			disabledCategory = true;
		} else {
			$selectedCategory = {};
			disabledCategory = false;
		}
	}

	async function submit() {
		$loading = true;
		console.log('submit', $transaction);
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

	async function close() {
		$drawerIsOpen = false;
		transferAmount = null;
		$selectedCategory = {};

		$transaction = {
			id: null,
			amount: null,
			account: null,
			type: 'expenses',
			note: null,
			transfer: null,
			category: null,
			budget: pb.authStore.model?.currentBudget,
			user: pb.authStore.model?.id,
			created: dayjs().toISOString(),
		};
	}

	async function onOpen() {
		$transaction.account = $accounts[0]?.id;
		$transaction.transfer = $accounts[1]?.id;
		$drawerIsOpen = true;
	}

	function categoryFilter(item: any, keywords: any) {
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
</script>

<Button on:click={() => onOpen()} size={'sm'} color={'green'} class="w-full max-w-[164px] text-sm">
	<Plus class="h-6 w-6" />
	Add transaction
</Button>

<Drawer bind:open={$drawerIsOpen} on:close={close}>
	<div class="pb-12 text-xl font-medium">Add transaction</div>

	<form on:submit|preventDefault={submit} class="grid max-w-sm gap-4">
		<TypeSwitch selected={$transaction.type} on:changed={(event) => changedType(event.detail)} />

		<div class="block w-full space-y-1 font-medium">
			<span class="text-sm"> Date </span>
			<DatePicker bind:value={$transaction.created} />
		</div>

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

		<div class="block space-y-1 font-medium">
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

		<div class="blockx w-full space-y-1 pt-2 font-medium">
			<span class="text-sm"> Note <span class="font-normal text-gray-400">(optional)</span> </span>
			<div class="">
				<input bind:value={$transaction.note} type="text" />
			</div>
		</div>

		<div class="pt-4">
			<Button loading={$loading} disabled={disabled} type="submit">
				{$transaction.id ? 'Update' : 'Add'}
			</Button>
		</div>
	</form>
</Drawer>
