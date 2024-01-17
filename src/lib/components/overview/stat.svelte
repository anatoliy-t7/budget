<script>
	import Money from '~icons/solar/money-bag-linear';
	import CourseUp from '~icons/solar/course-up-linear';
	import CourseDown from '~icons/solar/course-down-linear';
	import { overview, totalOverview, defaultCurrency } from '$lib/stores/transactions';
	import { moneyFormat } from '$lib/utils/utils';
	import Drawer from '../ui/drawer.svelte';

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
				<div class="mt-2 h-6 w-20 animate-pulse rounded-md bg-gray-300"></div>
			{/if}
		</div>
		<CourseUp class="h-12 w-12 text-green-500" />
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
				<div class="mt-2 h-6 w-20 animate-pulse rounded-md bg-gray-300"></div>
			{/if}
		</div>
		<CourseDown class="h-12 w-12 text-red-400" />
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
				<div class="mt-2 h-6 w-20 animate-pulse rounded-md bg-gray-300"></div>
			{/if}
		</div>
		<Money class="h-12 w-12 text-sky-500" />
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

				<div class="space-y-4 border-y border-gray-200 py-2">
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
