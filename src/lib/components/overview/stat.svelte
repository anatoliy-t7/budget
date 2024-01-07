<script lang="ts">
	import Money from '~icons/solar/money-bag-linear';
	import CourseUp from '~icons/solar/course-up-linear';
	import CourseDown from '~icons/solar/course-down-linear';
	import { overview } from '$lib/stores/transactions';
	import { moneyFormat } from '$lib/utils';
</script>

<div class="flex flex-wrap gap-4">
	<div class="flex min-w-[225px] justify-between gap-4 rounded-xl bg-white p-6">
		<div>
			<div class=" text-gray-500">Income</div>
			{#if Number($overview?.income) >= 0}
				<div class="text-2xl font-bold">{moneyFormat($overview?.income, $overview?.currency)}</div>
			{:else}
				<div class="mt-2 h-6 w-20 animate-pulse rounded-md bg-gray-300"></div>
			{/if}
		</div>
		<CourseUp class="h-12 w-12 text-green-500" />
	</div>

	<div class="flex min-w-[225px] items-center justify-between gap-4 rounded-xl bg-white p-6">
		<div>
			<div class=" text-gray-500">Expenses</div>
			{#if Number($overview?.expenses) >= 0}
				<div class="text-2xl font-bold">
					{moneyFormat($overview?.expenses, $overview?.currency)}
				</div>
			{:else}
				<div class="mt-2 h-6 w-20 animate-pulse rounded-md bg-gray-300"></div>
			{/if}
		</div>
		<CourseDown class="h-12 w-12 text-red-400" />
	</div>

	<div class="flex min-w-[225px] items-center justify-between gap-4 rounded-xl bg-white p-6">
		<div>
			<div class=" text-gray-500">Balance</div>
			{#if Number($overview?.balance) >= 0}
				<div class="text-2xl font-bold">
					{moneyFormat($overview?.balance, $overview?.currency)}
				</div>
			{:else}
				<div class="mt-2 h-6 w-20 animate-pulse rounded-md bg-gray-300"></div>
			{/if}
		</div>
		<Money class="h-12 w-12 text-sky-500" />
	</div>
</div>
