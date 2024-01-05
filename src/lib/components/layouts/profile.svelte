<script lang="ts">
	import Drawer from '$lib/components/ui/drawer.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import IconUser from '~icons/solar/user-circle-broken';

	import { alertOnFailure } from '$lib/utils';
	import { pb } from '$lib/stores/pocketbase';
	import { loading } from '$lib/stores/main';
	import toast from 'svelte-french-toast';

	const coll = pb.collection('users');

	let showProfile = false;

	async function submit() {
		$loading = true;

		toast.success(`Updated`);

		$loading = false;
	}

	async function close() {
		if (!confirm(`Do you want to close it?`)) return;
		showProfile = false;
	}

	async function onOpen() {
		showProfile = true;
	}
</script>

<button
	on:click={onOpen}
	type="button"
	class="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-gray-100">
	<IconUser class="h-7 w-7" />
	Profile
</button>

<Drawer bind:open={showProfile} on:close={close}>
	<div class="pb-6 text-xl font-medium">Your profile</div>

	<form on:submit|preventDefault={submit} class="grid max-w-sm gap-4">
		<div class="block w-full space-y-1 font-medium">
			<span class="text-sm"> Name </span>

			<div class="relative">
				<input type="text" />
			</div>
		</div>

		<div class="pt-4">
			<Button loading={$loading} type="submit" class="w-full">Update</Button>
		</div>
	</form>
</Drawer>
