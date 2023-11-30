<script lang="ts">
	import { Loader2 } from 'lucide-svelte';

	let className = 'w-6 h-6 text-green-500';
	export { className as class };
</script>

<Loader2 class="{className} animate-spin" />
