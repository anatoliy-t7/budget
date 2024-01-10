<script lang="ts">
	import Pencil from '~icons/tabler/pencil';
	import Trash from '~icons/solar/trash-bin-minimalistic-linear';
	import toast from 'svelte-french-toast';
	import { pb } from '$lib/stores/pocketbase';
	import { createEventDispatcher } from 'svelte';
	import {
		transaction,
		reset,
		isViewOpen,
		loading,
		selectedCategory,
		monthIsClosed,
	} from '$lib/stores/transactions';

	import dayjs from 'dayjs';

	import { moneyFormat } from '$lib/utils/utils';
	import Drawer from '../ui/drawer.svelte';
	import Gallery from '../ui/gallery.svelte';

	const dispatch = createEventDispatcher();
	const coll = pb.collection('transactions');

	async function onOpenEdit() {
		$transaction = {
			id: $transaction.id,
			amount: $transaction.amount,
			account: $transaction.account,
			type: $transaction.type,
			note: $transaction.note,
			transfer: $transaction.transfer,
			category: $transaction.category,
			budget: $transaction.budget,
			user: $transaction.user,
			created: $transaction.created,
			files: $transaction.files,
			tags: $transaction.tags,
		};

		$isViewOpen = false;

		setTimeout(() => {
			dispatch('open');
		}, 300);
	}

	async function onDelete() {
		if (confirm(`Do you confirm to delete the "${$transaction.type}" transaction?`)) {
			$loading = true;
			if ($transaction.files) {
				await pb.collection('files').delete($transaction.files);
			}

			await coll.delete($transaction.id);
			toast.success(`${$transaction.type} was deleted`);

			$loading = false;
			await close();
		}
	}

	async function close() {
		$isViewOpen = false;
		await reset();
	}
</script>

<Drawer bind:open={$isViewOpen} on:close={close}>
	<div class="flex h-full flex-col justify-between">
		<div>
			<div class="pb-6 text-xl font-medium">
				Transaction on <span class="font-normal text-gray-800"
					>{dayjs($transaction?.created).format('D MMM YYYY')}</span>
			</div>

			<div class="space-y-3 pb-6 capitalize">
				<div class="grid grid-cols-12 gap-4">
					<div class="col-span-3">{$transaction.type}:</div>

					<div class="col-span-9 text-lg text-gray-800">
						{moneyFormat($transaction.amount, $transaction?.expand?.account?.currency)}
					</div>
				</div>

				<div class="grid grid-cols-12 gap-4">
					<div class="col-span-3">Account:</div>

					<div class="col-span-9 text-lg text-gray-800">{$transaction?.expand?.account?.name}</div>
				</div>

				<div class="grid grid-cols-12 gap-4">
					<div class="col-span-3">Category:</div>

					<div class="col-span-9 flex items-center gap-2 text-lg text-gray-800">
						<div class="text-2xl">{$selectedCategory?.icon || ''}</div>
						<div>{$selectedCategory?.name}</div>
					</div>
				</div>

				<div class="grid grid-cols-12 gap-4">
					<div class="col-span-3">Tags:</div>

					<div class="col-span-9 text-lg lowercase text-gray-800">{$transaction.tags || ''}</div>
				</div>

				<div class="grid grid-cols-12 gap-4">
					<div class="col-span-3">Note:</div>

					<div class="col-span-9 text-lg lowercase text-gray-800">{$transaction.note}</div>
				</div>

				<div class="grid grid-cols-12 gap-4">
					<div class="col-span-3">By user:</div>

					<div class="col-span-9 text-lg text-gray-800">
						{$transaction?.expand?.user.name || $transaction?.expand?.user.email}
					</div>
				</div>
			</div>

			{#if $transaction?.expand?.files?.files?.length}
				<Gallery files={$transaction?.expand?.files?.files} />
			{/if}
		</div>

		<div class="flex w-full items-center gap-6">
			<button
				disabled={$loading}
				on:click={onDelete}
				class="click hovered text-red-500 disabled:cursor-not-allowed disabled:opacity-50">
				<Trash class="h-7 w-7" />
			</button>

			{#if !$monthIsClosed}
				<button on:click={onOpenEdit} class="click hovered hover:text-sky-500">
					<Pencil class="h-7 w-7" />
				</button>
			{/if}
		</div>
	</div>
</Drawer>
