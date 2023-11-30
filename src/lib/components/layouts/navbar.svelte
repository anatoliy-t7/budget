<script>
	import { client } from '$lib/pocketbase';
	import { LogOut } from 'lucide-svelte';
	import Logo from '$lib/components/ui/logo.svelte';

	import Transaction from '$lib/components/layouts/transaction.svelte';
</script>

<div
	class="shadow-small md:px-8 fixed inset-x-0 top-0 z-30 flex justify-between w-full gap-4 px-4 py-2 bg-white"
>
	<div class="flex items-center gap-3">
		<div class="w-48">
			<a href="/" class="block p-1">
				<Logo />
			</a>
		</div>
		<Transaction />
	</div>

	<div class="flex items-center justify-end">
		<button on:click={() => client.authStore.clear()} title="Log out" class="hover">
			<LogOut />
		</button>
	</div>
</div>
