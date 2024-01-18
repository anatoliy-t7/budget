<script>
	import Drawer from '$lib/components/ui/drawer.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Radio from '$lib/components/ui/radio.svelte';
	import Pencil from '~icons/tabler/pencil';
	import Trash from '~icons/solar/trash-bin-minimalistic-linear';
	import Add from '~icons/solar/add-circle-linear';
	import 'emoji-picker-element'; // https://github.com/nolanlawson/emoji-picker-element

	import { alertOnFailure } from '$lib/utils/utils';
	import { pb, authModel } from '$lib/stores/pocketbase';
	import { categories, getCategories, loading } from '$lib/stores/main';
	import toast from 'svelte-french-toast';
	import Dropdown from '../ui/dropdown.svelte';

	const radioOptions = [
		{
			value: 'income',
			label: 'Income',
		},
		{
			value: 'expenses',
			label: 'Expenses',
		},
	];
	const coll = pb.collection('categories');

	let open = false;
	let emojiPickerOpened = false;
	let category = {
		id: null,
		name: null,
		icon: null,
		type: 'expenses',
		ledger: $authModel?.ledger,
	};

	$: disabled = !category?.name;

	async function submit() {
		$loading = true;

		alertOnFailure(async () => {
			if (category.id) {
				await coll.update(category.id, category);
				toast.success(`${category.name} was updated`);
			} else {
				await coll.create(category);
				toast.success(`${category.name} was added`);
			}

			await getCategories();

			$loading = false;
			await close();
		});
	}

	async function close() {
		open = false;

		category.id = null;
		category.name = null;
		category.icon = null;
		category.type = 'expenses';
	}

	async function onOpen() {
		open = true;
	}

	/**
	 * @param {{ id: null; name: null; icon: null; type: string; ledger: any; }} item
	 */
	async function onOpenEdit(item) {
		category = item;
		open = true;
	}
	async function onDelete() {
		if (confirm(`Do you confirm to delete the "${category.name}" category?`)) {
			$loading = true;
			await coll.delete(category.id);
			toast.success(`${category.name} was deleted`);

			await getCategories();
			$loading = false;
			await close();
		}
	}
	function showEmojiPicker() {
		setTimeout(() => {
			document.querySelector('emoji-picker')?.addEventListener('emoji-click', (e) => {
				category.icon = e.detail.unicode;

				emojiPickerOpened = false;
			});
		}, 300);
	}
</script>

<div class="gap-4 rounded-xl bg-white pt-6">
	<div>
		<div class="flex items-center justify-between gap-6 px-6 pb-4">
			<div class="text-lg font-medium">Categories</div>
			<Button on:click={() => onOpen()} size={'sm'} color={'outline'} class="max-w-24 text-sm">
				Add new
			</Button>
		</div>

		<div>
			<div class="grid grid-cols-12 gap-6 px-6 py-1.5 text-sm text-gray-500">
				<div class="col-span-6">Name</div>
				<div class="col-span-6">Type</div>
			</div>
			{#if $categories?.length}
				<div class="scrollbar max-h-96 w-full overflow-y-auto pb-6">
					{#each $categories?.filter((c) => c.type !== 'transfer') as item}
						<div class="group grid grid-cols-12 gap-6 px-6 py-1.5 hover:bg-gray-100">
							<div class="col-span-6 capitalize">
								{item.icon}
								{item.name}
							</div>
							<div class="col-span-4 capitalize">
								{item.type}
							</div>
							<div class="col-span-2 flex justify-end">
								{#if item.ledger}
									<button
										on:click={() => onOpenEdit(item)}
										class="click hidden hover:text-sky-500 group-hover:flex">
										<Pencil class="h-6 w-6" />
									</button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex items-center justify-center py-4">You don't have any category</div>
			{/if}
		</div>
	</div>

	<Drawer bind:open={open} on:close={() => (open = false)}>
		<div class="max-w-sm">
			<div class="flex items-center justify-between gap-6 pb-6">
				<div class=" text-xl font-medium">Category</div>

				{#if category.id}
					<button on:click={onDelete} class="click hover text-red-500">
						<Trash class="h-6 w-6" />
					</button>
				{/if}
			</div>

			<form on:submit|preventDefault={submit} class="grid gap-6">
				<div class="flex gap-6">
					<div class="block w-full space-y-1 font-medium">
						<span class="text-sm"> Name </span>

						<input bind:value={category.name} required type="text" />
					</div>
				</div>

				<div class="flex gap-6">
					<div class="block w-full space-y-1 font-medium">
						<span class="text-sm">Transactions type </span>

						<Radio options={radioOptions} bind:selected={category.type} />
					</div>
				</div>

				<div class="block space-y-1 font-medium">
					<div class="text-sm">Icon</div>

					<div class="flex items-center gap-4">
						{#if category.icon}
							<span class="text-3xl">{category.icon}</span>
						{/if}

						<Dropdown bind:opened={emojiPickerOpened} on:open={showEmojiPicker}>
							<div slot="trigger">
								<Add class="h-8 w-8" />
							</div>
							<div slot="content" class="relative left-0 overflow-hidden rounded-lg">
								<emoji-picker></emoji-picker>
							</div>
						</Dropdown>
					</div>
				</div>

				<div class="pt-6">
					<Button loading={$loading} disabled={disabled} type="submit" class="w-full">
						{#if category.id}
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
