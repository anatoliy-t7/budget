<script lang="ts">
	import AddFile from '~icons/solar/camera-add-linear';
	import X from '~icons/solar/close-circle-linear';
	import Loader from './loader.svelte';

	import Compressor from 'compressorjs';
	import { onMount } from 'svelte';
	import { pb } from '$lib/stores/pocketbase';
	import { alertOnFailure, getPrivetImage } from '$lib/utils/utils';
	import toast from 'svelte-french-toast';

	import { fileToken } from '$lib/stores/main';

	export let id: string | null = null;

	let files: FileList;
	let loading = false;

	let recordFiles: any;
	$: recordFiles = null;

	const coll = pb.collection('files');

	async function compressImage(file: File): Promise<File> {
		return new Promise<File>((resolve, reject) => {
			new Compressor(file, {
				quality: 0.8,
				width: 1024,
				height: 1024,
				resize: 'cover',
				success: (result) => {
					resolve(new File([result], file.name, { type: result.type }));
				},
				error: (error: Error) => reject(error),
			});
		});
	}

	async function onFileInputChange(e: Event) {
		// collect promises from the compression function
		const compressPromises: Promise<File>[] = [];
		for (const file of e.target?.files) {
			compressPromises.push(compressImage(file));
		}

		// wait until these properties are resolved and loop through the result
		Promise.all(compressPromises)
			.then((compressedFiles) => {
				for (const file of compressedFiles) {
					// do whatever you need to do with these files - upload to server or whatever
				}
				upload(compressedFiles);
			})
			.catch((error) => console.error(error));
	}

	async function upload(compressedFiles: File[]) {
		loading = true;
		const formData = new FormData();

		if (compressedFiles?.length) {
			for (let file of compressedFiles) {
				formData.append('files', file);
			}
		}

		alertOnFailure(async () => {
			if (id) {
				recordFiles = await coll.update(id, formData);
			} else {
				recordFiles = await coll.create(formData);
				id = recordFiles.id;
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
		const fileArray = recordFiles?.files;
		var index = fileArray?.indexOf(value);
		if (index > -1) {
			fileArray?.splice(index, 1);
		}

		recordFiles.files = fileArray;
	}

	onMount(async () => {
		if (!$fileToken) {
			$fileToken = await pb.files.getToken();
		}

		if (id) {
			recordFiles = await coll.getOne(id);
		}
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
			on:change={onFileInputChange} />
	</div>

	{#if recordFiles?.files?.length}
		{#each recordFiles.files as file}
			<div
				class="group relative z-10 inline-flex h-16 w-16 items-center justify-center rounded-lg border border-gray-400 bg-white text-gray-400">
				{#await getPrivetImage(recordFiles, file) then src}
					<img src={src} class="h-16 w-16 rounded-lg object-cover" alt={file} />
				{/await}

				<div class="absolute inset-x-0 -top-4 z-10 hidden justify-center group-hover:flex">
					<button
						on:click={() => onDelete(file)}
						type="button"
						class="click rounded-full bg-white p-1 text-red-500 shadow hover:bg-red-500 hover:text-white">
						<X class="h-6 w-6" />
					</button>
				</div>
			</div>
		{/each}
	{/if}
</div>
