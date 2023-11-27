<script lang="ts">
	import { client } from '$lib/pocketbase';
</script>

<div
	class="fixed top-0 left-0 flex flex-col items-center justify-between w-32 h-full min-h-screen p-4"
>
	<div>Logo</div>

	<button on:click={() => client.authStore.clear()}>Logout</button>
</div>
