<script lang="ts">
	import Pencil from '~icons/tabler/pencil';
	import Trash from '~icons/solar/trash-bin-minimalistic-linear';
	import toast from 'svelte-french-toast';
	import BigPicture from 'bigpicture';
	import { pb } from '$lib/stores/pocketbase';
	import {
		transaction,
		openForView,
		openForEdit,
		loading,
		selectedCategory,
		monthIsClosed,
	} from '$lib/stores/transactions';
	import { fileToken } from '$lib/stores/main';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import { getPrivetImage, moneyFormat } from '$lib/utils';

	const coll = pb.collection('transactions');

	let recordFiles: any = null;

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
		};

		$openForView = false;
		$openForEdit = true;
	}

	async function onDelete(item: any) {
		if (confirm(`Do you confirm to delete the "${item.type}" transaction?`)) {
			$loading = true;
			await coll.delete(item.id);
			toast.success(`${item.type} was deleted`);

			$openForEdit = false;
			$loading = false;
		}
	}

	async function initGallery() {
		if (document.getElementById('lightbox')) {
			var imageLinks = document.querySelectorAll('#lightbox button');

			for (var i = 0; i < imageLinks.length; i++) {
				imageLinks[i].addEventListener('click', function (e) {
					e.preventDefault();
					BigPicture({
						el: e.target,
						gallery: '#lightbox',
						loop: true,
					});
				});
			}
		}
	}

	$: async () => {
		if (document.getElementById('lightbox') && recordFiles) {
			await initGallery();
		}
	};

	onMount(async () => {
		if (!$fileToken) {
			$fileToken = await pb.files.getToken();
		}

		if ($transaction?.expand?.files?.files?.length) {
			recordFiles = await pb.collection('files').getOne($transaction?.expand?.files?.id);
			setTimeout(async () => {
				await initGallery();
			}, 300);
		}
	});
</script>

<div class="flex h-full flex-col justify-between">
	<div>
		<div class="pb-6 text-xl font-medium">
			Transaction on <span class="font-normal text-gray-800"
				>{dayjs($transaction?.created).format('D MMM YYYY')}</span>
		</div>

		<div class="space-y-3 capitalize">
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

				<div class="col-span-9 text-lg text-gray-800">{$selectedCategory?.name}</div>
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

			<div class="grid gap-2">
				{#if $transaction?.expand?.files?.files?.length && recordFiles}
					<div class="">Files:</div>

					<div id="lightbox" class="flex flex-wrap items-center gap-2">
						{#each $transaction?.expand?.files?.files as file}
							{#await getPrivetImage(recordFiles, file, '1024x1024') then src}
								<button
									class=" h-32 w-32 overflow-hidden rounded-lg border border-transparent bg-white hover:border-sky-500">
									<img
										src={src}
										class="h-32 w-32 rounded-lg object-cover"
										alt={file}
										data-bp={src} />
								</button>
							{/await}
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex w-full items-center gap-6">
		<button
			disabled={$loading}
			on:click={() => onDelete($transaction)}
			class="click hover text-red-500 disabled:cursor-not-allowed disabled:opacity-50">
			<Trash class="h-7 w-7" />
		</button>

		{#if !$monthIsClosed}
			<button on:click={onOpenEdit} class="click hover hover:text-sky-500">
				<Pencil class="h-7 w-7" />
			</button>
		{/if}
	</div>
</div>
