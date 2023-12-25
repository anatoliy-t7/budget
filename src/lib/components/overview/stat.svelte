<script lang="ts">
	import Money from '~icons/solar/money-bag-linear';
	import CourseUp from '~icons/solar/course-up-linear';
	import CourseDown from '~icons/solar/course-down-linear';
	import { overview } from '$lib/stores/transactions';
	import { moneyFormat } from '$lib/utils';
</script>

<div class="flex flex-wrap gap-4">
	<div class="rounded-xl flex items-center gap-4 p-6 bg-white min-w-[225px] justify-between">
		<div>
			<div class=" text-gray-500">Income</div>
			<div class="text-2xl font-bold">{moneyFormat($overview?.income, $overview?.currency)}</div>
		</div>
		<CourseUp class="w-12 h-12 text-green-600" />
	</div>

	<div class="rounded-xl flex items-center gap-4 p-6 bg-white min-w-[225px] justify-between">
		<div>
			<div class=" text-gray-500">Expenses</div>
			<div class="text-2xl font-bold">{moneyFormat($overview?.expenses, $overview?.currency)}</div>
		</div>
		<CourseDown class="w-12 h-12 text-red-400" />
	</div>

	<div class="rounded-xl flex items-center gap-4 p-6 bg-white min-w-[225px] justify-between">
		<div>
			<div class=" text-gray-500">Balance</div>
			<div class="text-2xl font-bold">{moneyFormat($overview?.balance, $overview?.currency)}</div>
		</div>
		<Money class="text-sky-500 w-12 h-12" />
	</div>
</div>
