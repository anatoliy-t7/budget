<script>
	import { clickOutside } from '$lib/utils/utils';
	import { accounts } from '$lib/stores/main';
	import { slide } from 'svelte/transition';
	import Selector from '~icons/solar/alt-arrow-down-linear';
	import Check from '~icons/tabler/check';
	let className = 'left-0';
	export { className as class };

	export let value = $accounts[0]?.id;

	let isExpanded = false;

	$: selectedAccount = $accounts?.find((/** @type {{ id: any; }} */ a) => a.id == value);
</script>

<div use:clickOutside={() => (isExpanded = false)} class="relative">
	<button
		on:click={() => (isExpanded = true)}
		type="button"
		class="block w-full cursor-pointer appearance-none rounded-lg border border-gray-400 bg-white px-3 py-2.5 text-left shadow-sm ring-sky-300 transition placeholder:text-gray-400 hover:border-sky-400 focus:outline-none">
		<span class="block truncate">{selectedAccount?.name}</span>
		<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
			<Selector class="h-5 w-5 text-gray-400" />
		</span>
	</button>

	{#if isExpanded}
		<div
			transition:slide
			class="{className} absolute z-30 mt-1 max-h-60 w-full min-w-[320px] overflow-y-auto rounded-md border border-gray-200 bg-white py-1 text-sm shadow-small focus:outline-none">
			{#each $accounts as account}
				<button
					on:click={() => ((value = account.id), (isExpanded = false))}
					type="button"
					class="relative flex w-full cursor-pointer select-none items-center justify-between gap-4 px-4 py-2 text-left {account.id ===
					selectedAccount?.id
						? 'bg-amber-100 text-amber-900'
						: 'text-gray-900'}">
					<div class="flex items-center gap-4">
						<div class="w-5">
							{#if account.id === selectedAccount?.id}
								<span class="flex items-center text-amber-600">
									<Check class="h-5 w-5" />
								</span>
							{/if}
						</div>
						<span
							class="block truncate {account.id === selectedAccount?.id
								? 'font-medium'
								: 'font-normal'}">{account.name}</span>
					</div>

					<div class="w-8 text-left text-gray-400">{account?.currency}</div>
				</button>
			{/each}
		</div>
	{/if}
</div>
