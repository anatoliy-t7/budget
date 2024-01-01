<script>
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import { preparePageTransition } from '$lib/utils';
	import { accounts, categories, getAccounts, getCategories } from '$lib/stores/main';
	import { getOverview, overview, getTransactions } from '$lib/stores/transactions';
	import { pb, authModel } from '$lib/stores/pocketbase';

	preparePageTransition();

	const coll = pb.collection('transactions');

	$: if ($authModel) {
		coll.subscribe(
			'*',
			async function (e) {
				await getOverview();
				await getTransactions();
			},
			{
				filter: "type != 'closed' && type != 'opened'",
			},
		);
	} else {
		coll.unsubscribe();
	}

	onMount(async () => {
		if (!$overview) {
			getOverview();
		}
		if (!$accounts) {
			getAccounts();
		}
		if (!$categories) {
			getCategories();
		}

		// if (pwaInfo) {
		// 	const { registerSW } = await import('virtual:pwa-register');
		// 	registerSW({
		// 		immediate: true,
		// 		onRegistered(r: any) {
		// 			// uncomment following code if you want check for updates
		// 			r &&
		// 				setInterval(() => {
		// 					console.log('Checking for sw update');
		// 					r.update();
		// 				}, 20000 /* 20s for testing purposes */);
		// 			console.log(`SW Registered: ${r}`);
		// 		},
		// 		onRegisterError(error: Error) {
		// 			console.log('SW registration error', error);
		// 		},
		// 	});
		// }
	});

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	{@html webManifest}
</svelte:head>
