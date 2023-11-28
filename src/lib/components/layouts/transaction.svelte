<script>
	import { PlusSquare } from 'lucide-svelte';
	import Drawer from '$lib/components/ui/drawer.svelte';
	import { openCreateModal } from '$lib/stores/transactions';
</script>

<div>
	<button on:click={() => ($openCreateModal = true)} title="Log out" class="hover:text-amber-600">
		<PlusSquare class="w-8 h-8" strokeWidth={1.5} />
	</button>
</div>

<Drawer></Drawer>
