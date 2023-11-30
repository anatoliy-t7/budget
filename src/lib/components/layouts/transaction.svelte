<script lang="ts">
	import Drawer from '$lib/components/ui/drawer.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import TypeSwitch from '$lib/components/ui/type-switch.svelte';

	import { alertOnFailure } from '$lib/utils';
	import { client, authModel } from '$lib/pocketbase';
	import { Plus } from 'lucide-svelte';
	import { categories, accounts, loading } from '$lib/stores/transactions';

	const coll = client.collection('transactions');

	let open: boolean = false;
	let transaction = {
		amount: null,
		account: null,
		type: 'expenses',
		transfer: null,
		category: null,
		budget: $authModel?.defaultBudget,

		user: $authModel?.id,
	};

	$: disabled = !transaction.amount;
	$: transfer = transaction.type === 'transfer';

	async function submit() {
		$loading = true;
		alertOnFailure(async () => {
			if (transaction.type === 'transfer') {
				transaction.type = 'expenses';
				await coll.create(transaction);

				transaction.type = 'income';
				const from = transaction.account;
				transaction.account = transaction.transfer;
				transaction.transfer = from;
			}
			await coll.create(transaction);
		});

		$loading = false;
		open = false;
	}
</script>

<Button on:click={() => (open = true)} small={true} class="max-w-[164px]">
	<Plus class="w-6 h-6" strokeWidth={1.5} />
	Add transaction
</Button>

<Drawer bind:open>
	<div class="pb-12 text-xl font-medium">Add transaction</div>

	<form on:submit|preventDefault={submit} class="grid max-w-xs gap-5">
		<TypeSwitch
			selected={transaction.type}
			on:changed={(event) => (transaction.type = event.detail)}
		/>

		<div class="flex gap-6">
			<label class="block w-full space-y-1 text-sm font-medium">
				<div>
					{#if transfer}
						From
					{:else}
						Account
					{/if}
				</div>

				<select bind:value={transaction.account} required>
					{#each $accounts as account}
						<option value={account.id}>{account.name}</option>
					{/each}
				</select>
			</label>

			{#if transfer}
				<label class="block w-full space-y-1 text-sm font-medium">
					<div>To</div>

					<select bind:value={transaction.transfer} required>
						{#each $accounts as account}
							<option value={account.id}>{account.name}</option>
						{/each}
					</select>
				</label>
			{/if}
		</div>

		<label class="block space-y-1 text-sm font-medium">
			<span>Amount</span>

			<input bind:value={transaction.amount} required type="number" placeholder="100" />
		</label>

		<label class="block space-y-1 text-sm font-medium">
			<span>Category</span>

			<select bind:value={transaction.category} required>
				{#each $categories as category}
					<option value={category.id}>{category.name}</option>
				{/each}
			</select>
		</label>

		<Button loading={$loading} {disabled} type="submit">Add</Button>
	</form>
</Drawer>
