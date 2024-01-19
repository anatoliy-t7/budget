<script>
	import { PUBLIC_DOMAIN } from '$env/static/public';
	import { pb } from '$lib/stores/pocketbase';
	import { PRODUCT_LIST } from '$lib/utils/constants';
	import { alertOnFailure } from '$lib/utils/utils';
	import { fade } from 'svelte/transition';
	import IconCheck from '~icons/tabler/check';

	let period = 'monthly';
	let periods = ['monthly', 'yearly'];
	let loading = false;

	/**
	 * @param {{ id: string; name: string; access: number; trial: boolean; description: string; features: string[]; prices: { id: string; price: number; period: string; }[]; }} product
	 */
	async function onSubscribe(product) {
		loading = true;

		let priceId = period === 'monthly' ? product.prices[0].id : product.prices[1].id;

		await alertOnFailure(async () => {
			const res = await fetch(
				`${PUBLIC_DOMAIN}/api/checkout?userId=${pb.authStore.model?.id}&priceId=${priceId}`,
				{
					headers: {
						Authorization: pb.authStore.token,
					},
				},
			);

			console.log('res', res);

			loading = false;
		});
	}
</script>

<div>
	<div class="text-2xl font-medium text-center">Select your plan</div>

	<div class="pt-8 pb-4">
		<div class=" flex w-64 mx-auto bg-gray-200 rounded-lg">
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

	<div class="max-w-6xl mx-auto">
		<div class="lg:grid-cols-3 grid items-center grid-cols-2 gap-8">
			{#each PRODUCT_LIST as product}
				<div
					class="md:hauto rounded-3xl sm:p-6 md:p-8 xl:p-10 flex flex-col p-5 bg-white border border-gray-300">
					<span class=" text-2xl font-semibold text-gray-800"> {product.name} </span>
					<div class="md:text-3xl mt-2 text-2xl font-bold text-gray-900">
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
					<p class="sm:mt-6 mt-5 text-gray-700">
						{product.description}
					</p>
					<ul class="sm:mt6 flex flex-col mt-5 space-y-3 text-gray-600">
						{#each product.features as feature}
							<li class="gap-x-3 flex items-center">
								<IconCheck />
								{feature}
							</li>
						{/each}
					</ul>
					<div class="sm:mt-6 mt-5">
						<button
							on:click={() => onSubscribe(product)}
							class="click rounded-xl border-amber-400 bg-amber-400 ring-amber-200 hover:border-amber-500 hover:bg-amber-500 focus:ring-amber-200 flex items-center justify-center w-full gap-3 px-6 py-3 font-medium text-gray-800">
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
