<script lang="ts">
	import { clickOutside } from '$lib/utils';
	import { accounts } from '$lib/stores/transactions';
	import { slide } from 'svelte/transition';
	import Selector from '~icons/solar/alt-arrow-down-linear';
	import Check from '~icons/tabler/check';

	export let value: string | null = $accounts[0].id;

	let isExpanded = false;

	$: selectedAccount = $accounts?.find((a) => a.id == value);
</script>

<div use:clickOutside={() => (isExpanded = false)} class="relative">
	<button
		on:click={() => (isExpanded = true)}
		type="button"
		class="block w-full appearance-none rounded-lg border border-gray-300 bg-amber-50 bg-opacity-0 px-3 py-2.5 shadow-sm ring-amber-200 transition placeholder:text-gray-400 hover:border-amber-200 hover:bg-opacity-50 focus:outline-none cursor-pointer text-left"
	>
		<span class="block truncate">{selectedAccount?.name}</span>
		<span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
			<Selector class="w-5 h-5 text-gray-400" />
		</span>
	</button>

	{#if isExpanded}
		<div
			transition:slide
			class="max-h-60 min-w-[320px] focus:outline-none shadow-small absolute z-30 w-full py-1 mt-1 overflow-auto text-sm bg-white border border-gray-200 rounded-md"
		>
			{#each $accounts as account}
				<button
					on:click={() => ((value = account.id), (isExpanded = false))}
					type="button"
					class="relative text-left w-full cursor-pointer select-none py-2 px-4 flex gap-4 items-center justify-between {account.id ===
					selectedAccount?.id
						? 'bg-amber-100 text-amber-900'
						: 'text-gray-900'}"
				>
					<div class="flex items-center gap-4">
						<div class="w-5">
							{#if account.id === selectedAccount?.id}
								<span class="text-amber-600 flex items-center">
									<Check class="w-5 h-5" />
								</span>
							{/if}
						</div>
						<span
							class="block truncate {account.id === selectedAccount?.id
								? 'font-medium'
								: 'font-normal'}">{account.name}</span
						>
					</div>

					<div class="w-8 text-left text-gray-400">{account?.currency}</div>
				</button>
			{/each}
		</div>
	{/if}
</div>
