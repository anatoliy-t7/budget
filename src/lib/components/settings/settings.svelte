<script lang="ts">
	import toast from 'svelte-french-toast';
	import { alertOnFailure } from '$lib/utils/utils';
	import { pb } from '$lib/stores/pocketbase';
	import { loading, getBudget, budget } from '$lib/stores/main';
	import { onMount } from 'svelte';
	import { CURRENCY_LIST } from '$lib/utils/constants';
	import Button from '../ui/button.svelte';
	import Select from 'svelte-select/no-styles/Select.svelte';

	const coll = pb.collection('budgets');

	let defaultCurrency: any = {
		name: 'United States Dollar',
		code: 'USD',
	};

	async function submit() {
		$loading = true;
		$budget.defaultCurrency = defaultCurrency.code;

		alertOnFailure(async () => {
			await coll.update($budget?.id, $budget);
			toast.success(`Saved`);

			$loading = false;
			await getBudget();
		});
	}

	onMount(async () => {
		await getBudget();
		defaultCurrency = CURRENCY_LIST.find((c) => c.code == $budget?.defaultCurrency);
	});
</script>

<div class="gap-4 rounded-xl bg-white p-6">
	<form on:submit|preventDefault={submit} class="grid gap-6">
		<div class="block max-w-64 space-y-1 font-medium">
			<div class="text-sm">Default Currency</div>

			<Select
				items={CURRENCY_LIST}
				bind:value={defaultCurrency}
				required
				itemId={'code'}
				label={'code'}>
				<div slot="selection" let:selection>
					{selection.code} - {selection.name}
				</div>
				<div slot="item" let:item>
					{item.code} - {item.name}
				</div>
			</Select>
		</div>

		<div>
			<Button loading={$loading} size={'sm'} color={'amber'} type="submit">Save</Button>
		</div>
	</form>
</div>
