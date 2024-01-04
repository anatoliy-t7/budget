<script>
	import { pb } from '$lib/stores/pocketbase';
	import LogOut from '~icons/solar/logout-linear';
	import Logo from '$lib/components/ui/logo.svelte';

	import MonthRange from '$lib/components/ui/month-range.svelte';
	import Transaction from '$lib/components/layouts/transaction.svelte';
</script>

<div
	class="fixed inset-x-0 top-0 z-30 flex w-full justify-between gap-4 border-b border-gray-200 bg-white px-4 py-4 md:px-8">
	<div class="flex w-full items-center gap-4">
		<div class="w-[332px]">
			<a href="/" class="block p-1">
				<Logo />
			</a>
		</div>

		<Transaction />

		<MonthRange />
	</div>

	<div class="flex w-full items-center justify-end gap-6">
		<div>
			{pb.authStore.model?.name ? pb.authStore.model?.name : pb.authStore.model?.email}
		</div>
		<button on:click={() => pb.authStore.clear()} title="Log out" class="hover">
			<LogOut class="h-7 w-7" />
		</button>
	</div>
</div>
