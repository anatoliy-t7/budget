<script>
	import { authModel } from '$lib/stores/pocketbase';
	import { pb, loading } from '$lib/stores/pocketbase';
	import { PUBLIC_APP_NAME } from '$env/static/public';
	import Loader from '../ui/loader.svelte';
	import toast from 'svelte-french-toast';

	const coll = pb.collection('users');

	$: if (!$authModel?.verified) {
		coll.subscribe($authModel?.id, async function (e) {
			await coll.authRefresh();
		});
	} else {
		coll.unsubscribe();
	}

	async function resend() {
		$loading = true;
		await pb.collection('users').requestVerification($authModel?.email);

		$loading = false;
		toast.success('Email was send');
	}
</script>

<div class=" flex h-screen items-center justify-center">
	<div class="prose-xl relative max-w-3xl rounded-xl bg-white p-6">
		<p>
			Thank you for joining "{PUBLIC_APP_NAME}"!
		</p>
		<p>
			To activate your account and start exploring, please click the verification link that we sent
			to your email: <b> {$authModel?.email}</b>
		</p>

		<p>
			If you didn't receive it, <button
				on:click={resend}
				class="font-medium text-sky-500 hover:underline">
				click here
			</button>
			to send it again.

			{#if $loading}
				<div class="absolute bottom-6 right-5">
					<Loader />
				</div>
			{/if}
		</p>
	</div>
</div>
