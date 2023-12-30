<script lang="ts">
	import Drawer from '$lib/components/ui/drawer.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import TypeSwitch from '$lib/components/ui/type-switch.svelte';
	import Pencil from '~icons/tabler/pencil';
	import Trash from '~icons/solar/trash-bin-minimalistic-linear';
	// import Autocomplete from '$lib/components/ui/autocomplete.svelte';

	import { alertOnFailure } from '$lib/utils';
	import { pb, authModel } from '$lib/stores/pocketbase';
	import { categories, loading, getCategories } from '$lib/stores/transactions';
	import toast from 'svelte-french-toast';
	import { onDestroy } from 'svelte';
	const coll = pb.collection('categories');

	let open: boolean = false;
	let category: any = {
		id: null,
		name: null,
		icon: null,
		type: 'expenses',
		budget: $authModel?.currentBudget,
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

	async function onOpenEdit(item: any) {
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
</script>

<div class="gap-4 rounded-xl bg-white pt-6">
	<div>
		<div class="flex items-center justify-between gap-6 px-6 pb-4">
			<div class="text-lg font-medium">Categories</div>
			<Button on:click={() => onOpen()} small={true} theme={'empty'} class="max-w-24 text-sm">
				Add new
			</Button>
		</div>

		{#if $categories?.length}
			<div class="scrollbar max-h-96 w-full overflow-y-auto pb-6">
				{#each $categories as item}
					<div class="group grid grid-cols-12 gap-6 px-6 py-1.5 hover:bg-gray-100">
						<div class="col-span-6 capitalize">
							{item.name}
						</div>
						<div class="col-span-4 capitalize">
							{item.type}
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
			empty
		{/if}
	</div>

	<Drawer bind:open={open}>
		<div class="max-w-sm">
			<div class="flex items-center justify-between gap-6 pb-6">
				<div class=" text-xl font-medium">Category</div>

				{#if category.id}
					<button on:click={onDelete} class="click hover text-red-500">
						<Trash class=" h-6 w-6" />
					</button>
				{/if}
			</div>

			<form on:submit|preventDefault={submit} class="grid gap-4">
				<div class="flex gap-6">
					<div class="block w-full space-y-1 font-medium">
						<span class="text-sm"> Name </span>

						<input bind:value={category.name} required type="text" />
					</div>
				</div>

				<TypeSwitch bind:selected={category.type} />

				<div class="block space-y-1 font-medium">
					<div class="text-sm">Icon</div>
					<!--
			<Autocomplete
				items="{$categories}"
				bind:value="{transaction.category}"
				selectedItem="{selectedCategory}"
				itemFilterFunction="{categoryFilter}"
				labelFieldName="name"
				valueFieldName="id"
				matchAllKeywords="{false}"
				sortByMatchedKeywords="{true}"
				keywordsFieldName="name"
				disabled="{disabledCategory}"
				required /> -->
				</div>

				<div class="pt-4">
					<Button loading={$loading} disabled={disabled} type="submit">
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
