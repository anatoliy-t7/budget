<script>
	import { pb } from '$lib/stores/pocketbase';
	import LogOut from '~icons/solar/logout-linear';
	import { resetAll as resetAllMainStore } from '$lib/stores/main';
	import { resetAll } from '$lib/stores/transactions';
	import { goto } from '$app/navigation';

	function logOut() {
		resetAllMainStore();
		resetAll();
		pb.authStore.clear();
		goto('/');
	}
</script>

<button
	on:click={logOut}
	class="click flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-gray-100">
	<LogOut class="h-7 w-7" /> Log out
</button>
