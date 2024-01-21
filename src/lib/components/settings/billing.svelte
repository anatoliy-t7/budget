<script>
	import IconBilling from '~icons/solar/bill-broken';
	import IconPricing from '~icons/solar/dollar-minimalistic-broken';
	import { billingPortalUrl } from '$lib/stores/main';
	import { onMount } from 'svelte';
	import { PUBLIC_DOMAIN } from '$env/static/public';
	import { authModel } from '$lib/stores/pocketbase';

	let loading = false;

	async function getBillingPortalUrl() {
		if ($billingPortalUrl !== null) return;
		loading = true;
		const customerId = $authModel?.expand?.ledger?.stripe?.customerId;

		await fetch(`${PUBLIC_DOMAIN}/api/billing-link?customerId=${customerId}`)
			.then((res) => res.json())
			.then((res) => {
				$billingPortalUrl = res.url;
			});

		loading = false;
	}

	onMount(async () => {
		await getBillingPortalUrl();
	});
</script>

<div class="grid gap-6 p-6 bg-white rounded-xl">
	{#if $billingPortalUrl}
		<div class="flex items-center justify-start gap-2">
			<a href={$billingPortalUrl} class="flex items-center gap-2 link">
				<IconPricing class="w-5 h-5" />

				Billing page
			</a>
			<span class="pt-1 text-xs italic text-gray-500">(change subscription, etc)</span>
		</div>
	{/if}
</div>
