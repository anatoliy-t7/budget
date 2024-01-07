<script lang="ts">
	import Drawer from '$lib/components/ui/drawer.svelte';
	import Button from '$lib/components/ui/button.svelte';

	import { alertOnFailure } from '$lib/utils/utils';
	import { pb, authModel } from '$lib/stores/pocketbase';
	import { loading, editProfile } from '$lib/stores/main';
	import toast from 'svelte-french-toast';
	import { onMount } from 'svelte';

	const coll = pb.collection('users');

	let user: any = {
		id: null,
		name: null,
	};

	async function submit() {
		$loading = true;
		alertOnFailure(async () => {
			await coll.update(user.id, user);
			await coll.authRefresh();
		});

		toast.success(`Updated`);

		$loading = false;

		await close();
	}

	async function close() {
		//if (!confirm(`Do you want to close it?`)) return;
		$editProfile = false;
	}

	onMount(async () => {
		user = {
			id: $authModel?.id,
			name: $authModel?.name,
		};
	});
</script>

{#if $editProfile}
	<div class="pb-6 text-xl font-medium">Your profile</div>

	<form on:submit|preventDefault={submit} class="grid max-w-sm gap-4">
		<div class="block w-full space-y-1 font-medium">
			<span class="text-sm"> Name </span>

			<div class="relative">
				<input bind:value={user.name} type="text" />
			</div>
		</div>

		<div class="pt-4">
			<Button loading={$loading} type="submit" class="w-full">Update</Button>
		</div>
	</form>
{/if}
