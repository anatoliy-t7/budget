<script>
	import { PUBLIC_APP_NAME } from '$env/static/public';
</script>

<svelte:head>
	<title>Price | {PUBLIC_APP_NAME}</title>
	<script async src="https://js.stripe.com/v3/pricing-table.js"></script>
</svelte:head>

<stripe-pricing-table
	pricing-table-id="prctbl_1OXm5mFpaScIaMO0wXN7W6Jz"
	publishable-key="pk_test_51M2uI0FpaScIaMO0dB1BEMB99v9dYWFisVDk0JJv17qOgIlY26wB21c8YZLaljTnpfVvHmEgaJ4waUrAzeGEIvyD00rURMGKT1">
</stripe-pricing-table>
