<script lang="ts">
	import Drawer from '$lib/components/ui/drawer.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import TypeSwitch from '$lib/components/ui/type-switch.svelte';
	import ListboxAccount from '$lib/components/ui/listbox-account.svelte';
	import DatePicker from '$lib/components/ui/date-picker.svelte';

	import dayjs from 'dayjs';
	import { alertOnFailure } from '$lib/utils';
	import { client, authModel } from '$lib/stores/pocketbase';
	import Plus from '~icons/solar/add-circle-linear';
	import { categories, accounts, loading } from '$lib/stores/transactions';
	import toast from 'svelte-french-toast';

	const coll = client.collection('transactions');

	let open: boolean = false;
	let transaction = {
		amount: null,
		account: null,
		type: 'expenses',
		transfer: null,
		category: null,
		budget: $authModel?.currentBudget,
		user: $authModel?.id,
		created: dayjs().toISOString(),
	};
	let transferAmount: number | null = null;

	$: disabled = !transaction?.amount;

	$: transactionAccount = $accounts?.find((a) => a.id == transaction?.account);

	$: transferAccount = $accounts?.find((a) => a.id == transaction?.transfer);

	async function changedType(type: string) {
		if (transaction.type !== 'transfer') {
			transaction.transfer = $accounts[1].id;
		} else {
			transaction.transfer = null;
		}
		transaction.type = type;
	}

	async function submit() {
		$loading = true;

		alertOnFailure(async () => {
			transaction.created = dayjs(transaction.created)
				.set('hour', dayjs().get('hour'))
				.set('minute', dayjs().get('minute'))
				.set('second', dayjs().get('second'))
				.toISOString();

			if (transaction.type === 'transfer') {
				transaction.type = 'expenses';
				await coll.create(transaction);
				toast.success(`${transaction.type} was added`);

				transaction.type = 'income';
				const from = transaction.account;
				transaction.account = transaction.transfer;
				transaction.amount = transferAmount;
				transaction.transfer = from;
			}
			await coll.create(transaction);

			toast.success(`${transaction.type} was added`);
		});

		$loading = false;
		await close();
	}

	async function close() {
		open = false;
		transferAmount = null;
		transaction.transfer = null;
		transaction.amount = null;
		transaction.type = 'expenses';
	}

	async function onOpen() {
		transaction.account = $accounts[0]?.id;
		transaction.transfer = $accounts[1]?.id;
		open = true;
	}
</script>

<Button on:click="{() => onOpen()}" small="{true}" class="max-w-[164px]">
	<Plus class="h-6 w-6" />
	Add transaction
</Button>

<Drawer bind:open="{open}">
	<div class="pb-12 text-xl font-medium">Add transaction</div>

	<form on:submit|preventDefault="{submit}" class="grid max-w-sm gap-5">
		<TypeSwitch selected="{transaction.type}" on:changed="{(event) => changedType(event.detail)}" />

		<div class="block w-full space-y-1 text-sm font-medium">
			<span> Date </span>
			<DatePicker bind:value="{transaction.created}" />
		</div>

		<div class="flex gap-6">
			<div class="block w-full space-y-1 text-sm font-medium">
				<div>
					{#if transaction.type === 'transfer'}
						From
					{:else}
						Account
					{/if}
				</div>
				<ListboxAccount bind:value="{transaction.account}" />
			</div>

			{#if transaction.type === 'transfer'}
				<div class="block w-full space-y-1 text-sm font-medium">
					<div>To</div>

					<ListboxAccount bind:value="{transaction.transfer}" />
				</div>
			{/if}
		</div>

		<div class="flex gap-6">
			<label class="block w-full space-y-1 text-sm font-medium">
				<span>
					{#if transaction.type === 'transfer' && transactionAccount?.currency !== transferAccount?.currency}
						Sent amount
					{:else}
						Amount
					{/if}
				</span>

				<div class="relative">
					<input bind:value="{transaction.amount}" required type="number" placeholder="100" />
					{#if transactionAccount}
						<div class="absolute right-3 top-3 text-gray-400">
							{transactionAccount?.currency}
						</div>
					{/if}
				</div>
			</label>

			{#if transaction.type === 'transfer' && transactionAccount?.currency !== transferAccount?.currency}
				<label class="block w-full space-y-1 text-sm font-medium">
					<span> Got amount </span>
					<div class="relative">
						<input bind:value="{transferAmount}" type="number" placeholder="100" />
						{#if transferAccount}
							<div class="absolute right-3 top-3 text-gray-400">
								{transferAccount?.currency}
							</div>
						{/if}
					</div>
				</label>
			{/if}
		</div>

		<label class="block space-y-1 text-sm font-medium">
			<span>Category</span>

			<select bind:value="{transaction.category}" required>
				{#each $categories as category}
					<option value="{category.id}">{category.name}</option>
				{/each}
			</select>
		</label>

		<Button loading="{$loading}" disabled="{disabled}" type="submit">Add</Button>
	</form>
</Drawer>
