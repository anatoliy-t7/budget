<script>
	import PriceList from '../ui/price-list.svelte';
	import NeedVerification from '../ui/need-verification.svelte';
	import { authModel } from '$lib/stores/pocketbase';
</script>

{#if !$authModel.verified}
	<NeedVerification />
{:else}
	<PriceList />
{/if}
