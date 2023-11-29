<script lang="ts">
	import { client } from '$lib/pocketbase';
	import { LogOut, ActivitySquare, BarChartBig } from 'lucide-svelte';
	import Logo from '$lib/components/ui/logo.svelte';
	import Transaction from '$lib/components/layouts/transaction.svelte';
</script>

<div
	class="fixed top-0 left-0 flex flex-col items-center justify-between w-32 h-full min-h-screen px-4 py-6"
>
	<div class="flex flex-col items-center justify-center gap-8">
		<a href="/">
			<Logo />
		</a>
		<Transaction />
		<div class="space-y-6">
			<a href="/" class="hover block">
				<BarChartBig />
			</a>
			<a href="/transactions" class="hover block">
				<ActivitySquare />
			</a>
		</div>
	</div>

	<button on:click={() => client.authStore.clear()} title="Log out" class="hover">
		<LogOut />
	</button>
</div>
