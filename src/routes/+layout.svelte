<script>
	import { Toaster } from 'svelte-french-toast';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
</script>

<Toaster />
<ModeWatcher />

<slot />
