<script>
	import { client } from '$lib/stores/pocketbase';
	import LogOut from '~icons/solar/logout-linear';
	import Logo from '$lib/components/ui/logo.svelte';

	import MonthRange from '$lib/components/ui/month-range.svelte';
	import Transaction from '$lib/components/layouts/transaction.svelte';
</script>

<div
	class="md:px-8 fixed inset-x-0 top-0 z-30 flex justify-between w-full gap-4 px-4 py-4 bg-white border-b border-gray-200">
	<div class="flex items-center w-full gap-4">
		<div class="w-[332px]">
			<a href="/" class="block p-1">
				<Logo />
			</a>
		</div>

		<Transaction />

		<MonthRange />
	</div>

	<div class="flex items-center justify-end">
		<button on:click="{() => client.authStore.clear()}" title="Log out" class="hover">
			<LogOut class="h-7 w-7" />
		</button>
	</div>
</div>
