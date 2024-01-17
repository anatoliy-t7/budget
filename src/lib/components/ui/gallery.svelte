<script>
	import { fade } from 'svelte/transition';
	import IconDownload from '~icons/solar/file-download-linear';
	import BigPicture from 'bigpicture';
	import { transaction } from '$lib/stores/transactions';
	import { getPrivetImage } from '$lib/utils/utils';
	import { onMount } from 'svelte';
	import { fileToken } from '$lib/stores/main';
	import { pb } from '$lib/stores/pocketbase';

	/**
	 * @type {string | any[]}
	 */
	export let files = [];
	/**
	 * @type {import("pocketbase").RecordModel | null}
	 */
	let recordFiles = null;

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

		if (files?.length) {
			recordFiles = await pb.collection('files').getOne($transaction?.expand?.files?.id);

			setTimeout(async () => {
				await initGallery();
			}, 300);
		}
	});
</script>

<div transition:fade class="grid gap-2">
	{#if files.length && recordFiles}
		<div>Files:</div>

		<div id="lightbox" class="flex flex-wrap items-center gap-2">
			{#each files as file}
				{#await getPrivetImage(recordFiles, file, '1024x1024') then src}
					<div class="group relative">
						<button
							class="h-32 w-32 overflow-hidden rounded-lg border border-transparent bg-white hover:border-sky-500">
							<img src={src} class="h-32 w-32 rounded-lg object-cover" alt={file} data-bp={src} />
						</button>
						<div class="absolute right-2 top-2 hidden group-hover:flex">
							<a
								target="_blank"
								href={`${src}?download=1`}
								class="click inline-flex rounded-lg bg-white p-1.5 text-green-500 shadow hover:bg-green-500 hover:text-white">
								<IconDownload class="h-6 w-6" />
							</a>
						</div>
					</div>
				{/await}
			{/each}
		</div>
	{/if}
</div>
