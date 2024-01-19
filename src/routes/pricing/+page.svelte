<script>
	import { PUBLIC_APP_NAME, PUBLIC_DOMAIN, PUBLIC_STRIPE_KEY } from '$env/static/public';
	import { fade } from 'svelte/transition';
	import { authModel, pb } from '$lib/stores/pocketbase';
	import { PRODUCT_LIST } from '$lib/utils/constants';
	import { Elements } from 'svelte-stripe';

	import IconCheck from '~icons/tabler/check';
	import { loadStripe } from '@stripe/stripe-js';
	import { onMount } from 'svelte';

	/**
	 * @type {import("@stripe/stripe-js").Stripe}
	 */
	let stripe = null;
	/**
	 * @type {import("@stripe/stripe-js").StripeEmbeddedCheckout | HTMLDivElement | null}
	 */
	let checkout = null;

	let period = 'monthly';
	let periods = ['monthly', 'yearly'];
	let loading = false;

	/**
	 * @param {{ id?: string; name?: string; access: any; trial?: boolean; description?: string; features?: string[]; prices: any; }} product
	 */
	async function onSubscribe(product) {
		loading = true;

		let priceId = period === 'monthly' ? product.prices[0].id : product.prices[1].id;

		const res = await fetch(
			`${PUBLIC_DOMAIN}/api/checkout?userId=${pb.authStore.model?.id}&priceId=${priceId}&access=${product.access}`,
			{
				headers: {
					Authorization: pb.authStore.token,
				},
			},
		);

		const { clientSecret } = await res.json();
		console.log('clientSecret', clientSecret);
		checkout = await stripe.initEmbeddedCheckout({
			clientSecret,
		});
		checkout.mount('#checkout');

		loading = false;
	}

	onMount(async () => {
		// @ts-ignore
		stripe = await loadStripe(PUBLIC_STRIPE_KEY);
	});
</script>

<svelte:head>
	<title>Pricing | {PUBLIC_APP_NAME}</title>
</svelte:head>

<div transition:fade class="w-full pt-12">
	<div id="checkout"></div>

	{#if !checkout}
		<div>
			<div class="text-center text-2xl font-medium">Select your plan</div>

			<div class="pb-4 pt-8">
				<div class=" mx-auto flex w-64 rounded-lg bg-gray-200">
					{#each periods as item}
						<button
							on:click={() => (period = item)}
							type="button"
							class="{period === item
								? 'bg-amber-300 text-amber-950'
								: 'bg-gray-200 text-gray-500'} click w-32 rounded-lg p-3 text-base font-medium capitalize transition duration-300">
							{item}
						</button>
					{/each}
				</div>
			</div>

			<div class="mx-auto max-w-6xl">
				<div class="grid grid-cols-2 items-center gap-8 lg:grid-cols-3">
					{#each PRODUCT_LIST as product}
						<div
							class="md:hauto flex flex-col rounded-3xl border border-gray-300 bg-white p-5 sm:p-6 md:p-8 xl:p-10">
							<input
								name="priceId"
								type="hidden"
								value={period === 'monthly' ? product.prices[0].id : product.prices[1].id} />

							<input name="access" type="hidden" value={product.access} />
							<input name="userId" type="hidden" value={$authModel.id} />

							<span class=" text-2xl font-semibold text-gray-800"> {product.name} </span>
							<div class="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
								{#if period === 'monthly'}
									<span in:fade={{ duration: 200, delay: 200 }}>
										{product.prices[0].price} $
									</span>
								{:else}
									<span in:fade={{ duration: 200, delay: 200 }}>
										{product.prices[1].price} $
									</span>
								{/if}
							</div>
							<p class="mt-5 text-gray-700 sm:mt-6">
								{product.description}
							</p>
							<ul class="sm:mt6 mt-5 flex flex-col space-y-3 text-gray-600">
								{#each product.features as feature}
									<li class="flex items-center gap-x-3">
										<IconCheck />
										{feature}
									</li>
								{/each}
							</ul>

							<div class="mt-5 sm:mt-6">
								<button
									on:click={() => onSubscribe(product)}
									class="click flex w-full items-center justify-center gap-3 rounded-xl border-amber-400 bg-amber-400 px-6 py-3 font-medium text-gray-800 ring-amber-200 hover:border-amber-500 hover:bg-amber-500 focus:ring-amber-200">
									{#if product.trial}
										Start trial
									{:else}
										Subscribe
									{/if}
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
