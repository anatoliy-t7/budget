<script lang="ts">
	import Compressor from 'compressorjs';
	import AddFile from '~icons/solar/camera-add-linear';
	import X from '~icons/solar/close-circle-linear';
	import { pb } from '$lib/stores/pocketbase';
	import { alertOnFailure } from '$lib/utils';
	import toast from 'svelte-french-toast';
	import { onMount } from 'svelte';
	import Loader from './loader.svelte';

	export let id: string | null = null;

	let files: FileList;
	let loading = false;

	$: uploadedFiles = null;

	const coll = pb.collection('files');
	let fileToken = '';

	async function compressImage(e: Event) {
		const filesFromElement = (e.target as HTMLInputElement).files;

		if (!filesFromElement) return;

		for (let i = 0; i < filesFromElement.length; i++) {
			new Compressor(filesFromElement[i], {
				quality: 0.7,
				width: 1024,
				height: 1024,
				resize: 'cover',
				success(result: File | Blob) {
					let file: File;
					let name = (result as File).name;
					let type = (result as File).type;

					if (result instanceof Blob) {
						file = new File([result], 'compressed_' + name, { type });
					} else {
						file = result as File;
					}

					const dt = new DataTransfer();
					dt.items.add(file);
					if (filesFromElement) {
						for (let i = 1; i < filesFromElement.length; i++) {
							dt.items.add(filesFromElement[i]);
						}
					}
					files = dt.files;
				},

				error(err: Error) {
					console.error(err.message);
				},
			});
		}

		await upload();
	}

	async function upload() {
		loading = true;
		const formData = new FormData();

		if (files?.length) {
			for (let file of files) {
				formData.append('files', file);
			}
		}

		alertOnFailure(async () => {
			if (id) {
				uploadedFiles = await coll.update(id, formData);
			} else {
				uploadedFiles = await coll.create(formData);
				id = uploadedFiles.id;
			}

			loading = false;
		});
	}

	async function onDelete(file: any) {
		alertOnFailure(async () => {
			await coll.update(id, {
				'files-': [file],
			});

			toast.success(`${file} was deleted`);

			await removeItemFromArray(file);
		});
	}

	async function removeItemFromArray(value: string) {
		const fileArray = uploadedFiles?.files;
		var index = fileArray?.indexOf(value);
		if (index > -1) {
			fileArray?.splice(index, 1);
		}

		uploadedFiles.files = fileArray;
	}

	async function getUrl(file: any) {
		return pb.files.getUrl(uploadedFiles, file, { token: fileToken, thumb: '64x64' });
	}

	onMount(async () => {
		fileToken = await pb.files.getToken();
	});
</script>

<div class="flex flex-wrap items-center gap-2">
	<div class="">
		<label
			for="files"
			class="{loading
				? 'cursor-wait'
				: 'cursor-pointer'} group inline-flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-400 bg-white p-2 text-gray-400 hover:border-sky-500">
			{#if loading}
				<Loader class="h-8 w-8 text-sky-500" />
			{:else}
				<AddFile class="h-8 w-8 transition duration-300 group-hover:scale-110" />
			{/if}
		</label>
		<input
			class="hidden"
			id="files"
			type="file"
			name="file"
			multiple
			accept="image/*"
			disabled={loading}
			bind:files={files}
			on:change={compressImage} />
	</div>

	{#if uploadedFiles?.files?.length}
		{#each uploadedFiles.files as file}
			<div
				class="group relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-lg border border-gray-400 bg-white text-gray-400">
				{#await getUrl(file) then src}
					<img src={src} class="h-16 w-16 rounded-lg object-cover" alt={file} />
				{/await}

				<div class="absolute inset-x-0 -top-6 z-10 hidden justify-center group-hover:flex">
					<button
						on:click={() => onDelete(file)}
						type="button"
						class="rounded-full bg-white p-1 text-red-500 shadow hover:bg-red-500 hover:text-white">
						<X class="h-6 w-6" />
					</button>
				</div>
			</div>
		{/each}
	{/if}
</div>
