<script>
	import { PUBLIC_APP_NAME, PUBLIC_DOMAIN } from '$env/static/public';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { pb } from '$lib/stores/pocketbase';
	import { goto } from '$app/navigation';
	import { hasAccess } from '$lib/utils/utils';

	let loading = false;

	async function updateSubscription() {
		loading = true;
		const sessionId = $page.url.searchParams.get('sessionId');

		const res = await fetch(`${PUBLIC_DOMAIN}/api/stripe?sessionId=${sessionId}`, {});

		const data = await res.json();

		if (data.success) {
			await pb.collection('users').authRefresh();
		} else {
			goto('/pricing');
		}

		loading = false;
	}

	onMount(async () => {
		await updateSubscription();
	});
</script>

<svelte:head>
	<title>Welcome | {PUBLIC_APP_NAME}</title>
</svelte:head>

<div class="space-y-8 md:w-[48%] md:py-6 xl:w-[45%] xl:py-12">
	<div class="space-y-6">
		<h2 class=" text-2xl font-semibold text-gray-900">
			You joined thousands of happy users who are already enjoy our service.
		</h2>
		<p class="text-gray-700">
			Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quae odio consequatur aliquam
			ratione
		</p>
	</div>
	<ul role="list" class=" space-y-5 text-gray-600">
		<li class="flex items-start gap-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="fill-purple-600 h-5 w-5">
				<path
					fill-rule="evenodd"
					d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
					clip-rule="evenodd" />
			</svg>
			Advantage of this feature
		</li>
		<li class="flex items-start gap-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="fill-purple-600 h-5 w-5">
				<path
					fill-rule="evenodd"
					d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
					clip-rule="evenodd" />
			</svg>
			Advantage of this feature
		</li>
		<li class="flex items-start gap-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="fill-purple-600 h-5 w-5">
				<path
					fill-rule="evenodd"
					d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
					clip-rule="evenodd" />
			</svg>
			Advantage of this feature
		</li>
	</ul>
</div>
<div>
	hasAccess 1: {hasAccess(1)}
</div>
