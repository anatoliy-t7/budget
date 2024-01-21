<script>
	import '$lib/css/app.css';

	import { accounts, categories } from '$lib/stores/main';
	import { Toaster } from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import { authModel } from '$lib/stores/pocketbase';
	import Auth from '$lib/components/auth/auth.svelte';
	import Body from '$lib/components/layouts/body.svelte';
	import { onMount } from 'svelte';
	import { hasAccess } from '$lib/utils/utils';
	import Starter from '$lib/components/layouts/starter.svelte';
	import { page } from '$app/stores';

	/**
	 * @type {string | URL | null}
	 */
	export let destination = null;
	$: if (destination != null && $authModel) {
		goto(destination);
	}

	export let data;

	$: planSelected = $authModel && hasAccess(1);

	onMount(async () => {
		$accounts = data.accounts;
		$categories = data.categories;
	});
</script>

{#if $authModel}
	{#if $page.url.pathname !== '/welcome' && !planSelected}
		<Starter />
	{:else}
		<Body>
			<slot />
		</Body>
	{/if}
{:else}
	<Auth />
{/if}

<Toaster />
