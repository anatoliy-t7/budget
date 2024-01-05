<script lang="ts">
	import Drawer from '$lib/components/ui/drawer.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Pencil from '~icons/tabler/pencil';
	import Trash from '~icons/solar/trash-bin-minimalistic-linear';
	import Autocomplete from '$lib/components/ui/autocomplete.svelte';

	import { alertOnFailure } from '$lib/utils';
	import { pb, authModel } from '$lib/stores/pocketbase';
	import { accounts, loading, getAccounts } from '$lib/stores/main';

	import toast from 'svelte-french-toast';
	import { CURRENCY } from '$lib/stores/main';
	const coll = pb.collection('accounts');

	let open: boolean = false;
	let account: any = {
		id: null,
		name: null,
		currency: 'USD',
		budget: $authModel?.budget,
	};

	$: disabled = !account?.name;

	async function submit() {
		$loading = true;

		alertOnFailure(async () => {
			if (account.id) {
				await coll.update(account.id, account);
				toast.success(`${account.name} was updated`);
			} else {
				await coll.create(account);
				toast.success(`${account.name} was added`);
			}

			await getAccounts();

			$loading = false;
			await close();
		});
	}

	async function close() {
		open = false;

		account.id = null;
		account.name = null;
		account.currency = 'USD';
	}

	async function onOpen() {
		open = true;
	}

	async function onOpenEdit(item: any) {
		account = item;
		open = true;
	}
	async function onDelete() {
		if (confirm(`Do you confirm to delete the "${account.name}" account?`)) {
			$loading = true;
			await coll.delete(account.id);
			toast.success(`${account.name} was deleted`);

			await getAccounts();
			$loading = false;
			await close();
		}
	}
</script>

<div class="gap-4 rounded-xl bg-white pt-6">
	<div>
		<div class="flex items-center justify-between gap-6 px-6 pb-4">
			<div class="text-lg font-medium">Accounts</div>
			<Button on:click={() => onOpen()} size={'sm'} color={'outline'} class="max-w-24 text-sm">
				Add new
			</Button>
		</div>
		<div>
			<div class=" grid grid-cols-12 gap-6 px-6 py-1.5 text-sm text-gray-500">
				<div class="col-span-6">Name</div>
				<div class="col-span-6">Currency</div>
			</div>
			{#if $accounts?.length}
				<div class="scrollbar max-h-96 w-full overflow-y-auto pb-6">
					{#each $accounts as item}
						<div class="group grid grid-cols-12 gap-6 px-6 py-1.5 hover:bg-gray-100">
							<div class="col-span-6 capitalize">
								{item.name}
							</div>
							<div class="col-span-4 capitalize">
								{item.currency}
							</div>
							<div class="col-span-2 flex justify-end">
								<button
									on:click={() => onOpenEdit(item)}
									class="click hidden hover:text-sky-500 group-hover:flex">
									<Pencil class="h-6 w-6" />
								</button>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex items-center justify-center py-4">You don't have any account</div>
			{/if}
		</div>
	</div>

	<Drawer bind:open={open} on:close={() => (open = false)}>
		<div class="max-w-sm">
			<div class="flex items-center justify-between gap-6 pb-6">
				<div class=" text-xl font-medium">Account</div>

				{#if account.id}
					<button on:click={onDelete} class="click hover text-red-500">
						<Trash class=" h-6 w-6" />
					</button>
				{/if}
			</div>

			<form on:submit|preventDefault={submit} class="grid gap-6">
				<div class="flex gap-6">
					<div class="block w-full space-y-1 font-medium">
						<span class="text-sm"> Name </span>

						<input bind:value={account.name} required type="text" />
					</div>
				</div>

				<div class="block space-y-1 font-medium">
					<div class="text-sm">Currency</div>

					<Autocomplete
						items={$CURRENCY}
						bind:selectedItem={account.currency}
						matchAllKeywords={false}
						sortByMatchedKeywords={true}
						keywordsFieldName="name"
						required />
				</div>

				<div class="pt-6">
					<Button loading={$loading} disabled={disabled} type="submit" class="w-full">
						{#if account.id}
							Update
						{:else}
							Add
						{/if}
					</Button>
				</div>
			</form>
		</div>
	</Drawer>
</div>
