<script>
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>Price | {PUBLIC_APP_NAME}</title>
	<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
</svelte:head>

<div transition:fade class="flex h-screen items-center justify-center">
	<div class="w-full">
		<div class="pb-6 text-center text-xl font-medium">Select your plan</div>
		<stripe-pricing-table
			pricing-table-id="prctbl_1OXm5mFpaScIaMO0wXN7W6Jz"
			publishable-key="pk_test_51M2uI0FpaScIaMO0dB1BEMB99v9dYWFisVDk0JJv17qOgIlY26wB21c8YZLaljTnpfVvHmEgaJ4waUrAzeGEIvyD00rURMGKT1">
		</stripe-pricing-table>
	</div>
</div>
