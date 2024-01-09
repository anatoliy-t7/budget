<script lang="ts">
	import Money from '~icons/solar/money-bag-linear';
	import CourseUp from '~icons/solar/course-up-linear';
	import CourseDown from '~icons/solar/course-down-linear';
	import { overview, totalOverview, defaultCurrency } from '$lib/stores/transactions';
	import { moneyFormat } from '$lib/utils/utils';
	import Drawer from '../ui/drawer.svelte';
	import Table from '../ui/table.svelte';

	let openOverview = false;
</script>

<div class="flex flex-wrap gap-4">
	<button
		on:click={() => (openOverview = true)}
		class="flex min-w-[225px] justify-between gap-4 rounded-xl border border-white bg-white p-6 text-left hover:border-gray-400">
		<div>
			<div class=" text-gray-500">Income</div>
			{#if Number($totalOverview?.income) >= 0}
				<div class="text-2xl font-bold">
					{moneyFormat($totalOverview?.income, $defaultCurrency)}
				</div>
			{:else}
				<div class="animate-pulse w-20 h-6 mt-2 bg-gray-300 rounded-md"></div>
			{/if}
		</div>
		<CourseUp class="w-12 h-12 text-green-500" />
	</button>

	<button
		on:click={() => (openOverview = true)}
		class=" flex min-w-[225px] items-center justify-between gap-4 rounded-xl border border-white bg-white p-6 text-left hover:border-gray-400">
		<div>
			<div class=" text-gray-500">Expenses</div>
			{#if Number($totalOverview?.expenses) >= 0}
				<div class="text-2xl font-bold">
					{moneyFormat($totalOverview?.expenses, $defaultCurrency)}
				</div>
			{:else}
				<div class="animate-pulse w-20 h-6 mt-2 bg-gray-300 rounded-md"></div>
			{/if}
		</div>
		<CourseDown class="w-12 h-12 text-red-400" />
	</button>

	<button
		on:click={() => (openOverview = true)}
		class=" flex min-w-[225px] items-center justify-between gap-4 rounded-xl border border-white bg-white p-6 text-left hover:border-gray-400">
		<div>
			<div class=" text-gray-500">Balance</div>
			{#if Number($totalOverview?.balance) >= 0}
				<div class="text-2xl font-bold">
					{moneyFormat($totalOverview?.balance, $defaultCurrency)}
				</div>
			{:else}
				<div class="animate-pulse w-20 h-6 mt-2 bg-gray-300 rounded-md"></div>
			{/if}
		</div>
		<Money class="text-sky-500 w-12 h-12" />
	</button>
</div>

<Drawer bind:open={openOverview} on:close={() => (openOverview = false)}>
	<div class=" h-full">
		<div class="pb-6 text-xl font-medium">Overview</div>

		<div>
			{#if $overview}
				<div class="grid grid-cols-12 gap-4 pb-2 text-base font-medium">
					<div class="col-span-3">Account</div>
					<div class="col-span-3 text-right">Income</div>
					<div class="col-span-3 text-right">Expenses</div>
					<div class="col-span-3 text-right">Balance</div>
				</div>

				<div class="border-y py-2 space-y-4 border-gray-200">
					{#each Object.values($overview) as item}
						<div class="grid grid-cols-12 gap-4">
							<div class="col-span-3">
								{item.account}
							</div>
							<div class="col-span-3 text-right">
								{moneyFormat(item.income, item.currency)}
							</div>
							<div class="col-span-3 text-right">
								{moneyFormat(item.expenses, item.currency)}
							</div>
							<div class="col-span-3 text-right">
								{moneyFormat(item.balance, item.currency)}
							</div>
						</div>
					{/each}
				</div>

				<div class="grid grid-cols-12 gap-4 pt-2 text-base font-medium">
					<div class="col-span-3">Total</div>
					<div class="col-span-3 text-right">
						{#if Number($totalOverview?.income) >= 0}
							{moneyFormat($totalOverview?.income, $defaultCurrency)}
						{/if}
					</div>
					<div class="col-span-3 text-right">
						{#if Number($totalOverview?.expenses) >= 0}
							{moneyFormat($totalOverview?.expenses, $defaultCurrency)}
						{/if}
					</div>
					<div class="col-span-3 text-right">
						{#if Number($totalOverview?.balance) >= 0}
							{moneyFormat($totalOverview?.balance, $defaultCurrency)}
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</Drawer>
