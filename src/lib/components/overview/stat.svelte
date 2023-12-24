<script lang="ts">
	import Money from '~icons/solar/money-bag-linear';
	import CourseUp from '~icons/solar/course-up-linear';
	import CourseDown from '~icons/solar/course-down-linear';
	import { overview } from '$lib/stores/transactions';
</script>

<div class="stats border border-gray-300">
	<div class="stat">
		<div class="stat-figure text-secondary">
			<CourseUp class="w-8 h-8" />
		</div>
		<div class="stat-title">Income</div>
		<div class="stat-value">{$overview?.income}</div>
		<div class="stat-desc">{$overview?.currency}</div>
	</div>

	<div class="stat">
		<div class="stat-figure text-secondary">
			<CourseDown class="w-8 h-8" />
		</div>
		<div class="stat-title">Expenses</div>
		<div class="stat-value">{$overview?.expenses}</div>
		<div class="stat-desc">{$overview?.currency}</div>
	</div>

	<div class="stat">
		<div class="stat-figure text-secondary">
			<Money class="w-8 h-8" />
		</div>
		<div class="stat-title">Balance</div>
		<div class="stat-value">{$overview?.balance}</div>
		<div class="stat-desc">{$overview?.currency}</div>
	</div>
</div>
