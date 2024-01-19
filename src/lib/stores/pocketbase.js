import PocketBase, { RecordService } from 'pocketbase';
import { writable } from 'svelte/store';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { alertOnFailure } from '$lib/utils/utils';

export const loading = writable(false);
export const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
export const authModel = writable();

/*
 * Save (create/update) a record (a plain object). Automatically converts to
 * FormData if needed.
 */
/**
 * @param {string} collection
 * @param {{ [x: string]: any; collectionId?: string; collectionName?: string; expand?: { [key: string]: any; } | undefined; id?: any; created?: string; updated?: string; }} record
 */
export async function save(collection, record, create = false) {
	// convert obj to FormData in case one of the fields is instanceof FileList
	const data = object2formdata(record);
	if (record.id && !create) {
		// "create" flag overrides update
		return await pb.collection(collection).update(record.id, data);
	} else {
		return await pb.collection(collection).create(data);
	}
}

// convert obj to FormData in case one of the fields is instanceof FileList
/**
 * @param {{ [s: string]: any; } | ArrayLike<any>} obj
 */
function object2formdata(obj) {
	// check if any field's value is an instanceof FileList
	if (!Object.values(obj).some((val) => val instanceof FileList || val instanceof File)) {
		// if not, just return the original object
		return obj;
	}
	// otherwise, build FormData (multipart/form-data) from obj
	const fd = new FormData();
	for (const [key, val] of Object.entries(obj)) {
		if (val instanceof FileList) {
			for (const file of val) {
				fd.append(key, file);
			}
		} else if (val instanceof File) {
			// handle File before "object" so that it doesn't get serialized as JSON
			fd.append(key, val);
		} else if (Array.isArray(val)) {
			// for some reason, multipart/form-data wants arrays to be comma-separated strings
			fd.append(key, val.join(','));
		} else if (typeof val === 'object') {
			fd.append(key, JSON.stringify(val));
		} else {
			fd.append(key, val);
		}
	}
	return fd;
}

/**
 * @param {import("pocketbase").AuthProviderInfo} provider
 * @param {RecordService<import("pocketbase").RecordModel>} authCollection
 */
export async function providerLogin(provider, authCollection) {
	loading.set(true);

	let w = window.open();

	await alertOnFailure(async () => {
		const authResponse = await authCollection.authWithOAuth2({
			provider: provider.name,
			urlCallback: (url) => {
				w.location.href = url;
			},
			createData: {
				emailVisibility: true,
				verified: true,
			},
		});

		// update user "record" if "meta" has info it doesn't have
		const { meta, record } = authResponse;
		let changes = {};
		if (!record.name && meta?.name) {
			changes.name = meta.name;
		}
		// if (!record.avatar && meta?.avatarUrl) {
		//   const response = await fetch(meta.avatarUrl);
		//   if (response.ok) {
		//     const type = response.headers.get("content-type") ?? "image/jpeg";
		//     changes.avatar = new File([await response.blob()], "avatar", { type });
		//   }
		// }
		if (Object.keys(changes).length) {
			authResponse.record = await save(authCollection.collectionIdOrName, {
				...record,
				...changes,
			});
		}

		loading.set(false);

		return authResponse;
	});
}
