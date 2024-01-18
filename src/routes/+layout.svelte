<script>
	import '$lib/css/app.css';

	import { Toaster } from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import { authModel } from '$lib/stores/pocketbase';

	import Auth from '$lib/components/auth/auth.svelte';

	import { hasAccess } from '$lib/utils/utils';
	import NeedVerification from '$lib/components/layouts/need-verification.svelte';
	import PriceList from '$lib/components/layouts/select-price.svelte';

	import Body from '$lib/components/layouts/body.svelte';

	/**
	 * @type {string | URL | null}
	 */
	export let destination = null;
	$: if (destination != null && $authModel) {
		goto(destination);
	}
</script>

{#if $authModel}
	{#if !$authModel.verified}
		<NeedVerification />
	{:else if !hasAccess(1)}
		<PriceList />
	{:else}
		<Body>
			<slot />
		</Body>
	{/if}
{:else}
	<Auth />
{/if}

<Toaster />
