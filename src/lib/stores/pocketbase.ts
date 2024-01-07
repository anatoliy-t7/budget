import PocketBase, {
  type AuthProviderInfo,
  RecordService,
} from "pocketbase";
import type Record from "pocketbase"
import { readable, writable } from "svelte/store";
import { browser } from "$app/environment";
import { invalidateAll } from "$app/navigation";
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { alertOnFailure } from '$lib/utils/utils';

export const loading = writable(false);

export const pb = new PocketBase(
  browser ? PUBLIC_POCKETBASE_URL : undefined
);

export const authModel = readable<Record | null>(
  null,
  function (set: any) {
    pb.authStore.onChange((token, model) => {
      set(model);
      invalidateAll(); // re-run load functions for current page

    }, true);
  }
);

/*
 * Save (create/update) a record (a plain object). Automatically converts to
 * FormData if needed.
 */
export async function save(collection: string, record: any, create = false) {
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
function object2formdata(obj: {}) {
  // check if any field's value is an instanceof FileList
  if (
    !Object.values(obj).some(
      (val) => val instanceof FileList || val instanceof File
    )
  ) {
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
      fd.append(key, val.join(","));
    } else if (typeof val === "object") {
      fd.append(key, JSON.stringify(val));
    } else {
      fd.append(key, val as any);
    }
  }
  return fd;
}

export async function providerLogin(
  provider: AuthProviderInfo,
  authCollection: RecordService
) {
  loading.set(true);

  await alertOnFailure(async () => {
    const authResponse = await authCollection.authWithOAuth2({
      provider: provider.name,
      createData: {
        // emailVisibility: true,
      },
    });

    // update user "record" if "meta" has info it doesn't have
    const { meta, record } = authResponse;
    let changes = {} as { [key: string]: any };
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
  })
}
