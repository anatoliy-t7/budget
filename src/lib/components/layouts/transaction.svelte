<script lang="ts">
	import Drawer from '$lib/components/ui/drawer.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import TypeSwitch from '$lib/components/ui/type-switch.svelte';

	import { alertOnFailure } from '$lib/utils';
	import { client, authModel } from '$lib/pocketbase';
	import { PlusSquare } from 'lucide-svelte';
	import { categories, accounts, loading } from '$lib/stores/transactions';

	const coll = client.collection('transactions');

	let open: boolean = false;
	let transaction = {
		amount: null,
		type: 'expenses',
		category: null,
		account: null,
		budget: $authModel?.defaultBudget,
		user: $authModel?.id,
	};

	$: disabled = !transaction.amount;

	async function submit() {
		$loading = true;
		alertOnFailure(async () => {
			await coll.create(transaction);
		});
		$loading = false;
		open = false;
	}
</script>

<div>
	<button on:click={() => (open = true)} title="Log out" class="hover:text-amber-600">
		<PlusSquare class="w-8 h-8" strokeWidth={1.5} />
	</button>
</div>

<Drawer bind:open>
	<div class="pb-12 text-xl font-medium">Add transaction</div>

	<form on:submit|preventDefault={submit} class="grid max-w-xs gap-5">
		<TypeSwitch
			selected={transaction.type}
			on:changed={(event) => (transaction.type = event.detail)}
		/>

		<label class="block space-y-1 text-sm font-medium">
			<span>Account</span>

			<select bind:value={transaction.account} required>
				{#each $accounts as account}
					<option value={account.id}>{account.name}</option>
				{/each}
			</select>
		</label>

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
