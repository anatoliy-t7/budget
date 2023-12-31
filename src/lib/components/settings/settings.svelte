<script lang="ts">
	import toast from 'svelte-french-toast';
	import { alertOnFailure } from '$lib/utils';
	import { pb } from '$lib/stores/pocketbase';
	import { loading, getBudget, budget } from '$lib/stores/main';
	import { onMount } from 'svelte';
	import { CURRENCY } from '$lib/stores/main';
	import Button from '../ui/button.svelte';
	import Autocomplete from '../ui/autocomplete.svelte';

	const coll = pb.collection('budgets');

	let defaultCurrency = 'USD';

	async function submit() {
		$loading = true;
		$budget.defaultCurrency = defaultCurrency;

		alertOnFailure(async () => {
			await coll.update($budget?.id, $budget);
			toast.success(`Saved`);

			$loading = false;
			await getBudget();
		});
	}

	function currencyFilter(item: any, keywords: any) {
		return item;
	}

	onMount(async () => {
		await getBudget();
		defaultCurrency = $budget?.defaultCurrency;
	});
</script>

<div class="gap-4 rounded-xl bg-white p-6">
	<form on:submit|preventDefault={submit} class="grid gap-6">
		<div class="block max-w-32 space-y-1 font-medium">
			<div class="text-sm">Default Currency</div>

			<Autocomplete
				items={$CURRENCY}
				bind:selectedItem={defaultCurrency}
				itemFilterFunction={currencyFilter}
				matchAllKeywords={false}
				sortByMatchedKeywords={true}
				dropdownClassName="max-w-32"
				minCharactersToSearch={0} />
		</div>

		<div>
			<Button loading={$loading} size={'sm'} color={'amber'} type="submit">Save</Button>
		</div>
	</form>
</div>
