<script>
	// @ts-nocheck

	import toast from 'svelte-french-toast';
	import { alertOnFailure } from '$lib/utils/utils';
	import { pb } from '$lib/stores/pocketbase';
	import { loading, getBudget, ledger } from '$lib/stores/main';
	import { getOverview } from '$lib/stores/transactions';
	import { onMount } from 'svelte';
	import { CURRENCY_LIST, MONTHS } from '$lib/utils/constants';
	import Button from '../ui/button.svelte';
	import Select from 'svelte-select/no-styles/Select.svelte';

	const coll = pb.collection('ledgers');

	let defaultCurrency = {
		name: 'United States Dollar',
		code: 'USD',
	};
	let financeYearStartFrom = {
		value: 0,
		label: 'January',
	};

	async function save() {
		$loading = true;
		$ledger.defaultCurrency = defaultCurrency.code;

		if (!$ledger.settings) {
			$ledger.settings = {};
		}
		$ledger.settings.financeYearStartFrom = financeYearStartFrom.value;

		alertOnFailure(async () => {
			await coll.update($ledger?.id, $ledger);
			await pb.collection('users').authRefresh();

			toast.success(`Saved`);

			$loading = false;
			await getBudget();
			await getOverview();
		});
	}

	onMount(async () => {
		await getBudget();
		defaultCurrency = CURRENCY_LIST.find((c) => c.code == $ledger?.defaultCurrency);

		if ($ledger?.settings?.financeYearStartFrom) {
			financeYearStartFrom = MONTHS.find((c) => c.value == $ledger?.settings?.financeYearStartFrom);
		}
	});
</script>

<div class="grid gap-6 rounded-xl bg-white p-6">
	<div class="flex w-full flex-wrap gap-6">
		<div class="block w-full max-w-64 space-y-1 font-medium">
			<div class="text-sm">Default Currency</div>

			<Select
				items={CURRENCY_LIST}
				bind:value={defaultCurrency}
				showChevron={true}
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

		<div class="block w-full max-w-64 space-y-1 font-medium">
			<div class="text-sm">Finance year start from</div>

			<Select
				items={MONTHS}
				bind:value={financeYearStartFrom}
				clearable={false}
				showChevron={true}
				required></Select>
		</div>
	</div>
	<div>
		<Button on:click={save} loading={$loading} size={'sm'} color={'amber'} type="button">
			Save
		</Button>
	</div>
</div>
