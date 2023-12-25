import { writable, readable, get } from 'svelte/store';
import { client, authModel } from '$lib/pocketbase';
import { alertOnFailure } from '$lib/utils';
import dayjs from 'dayjs';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
export const monthRange = writable( {
    start: dayjs().startOf('month').toISOString(),
    end: dayjs().endOf('month').toISOString(),
})
const auth = get(authModel);
const range = get(monthRange);

export const types = readable( [
    'expenses', 'income', 'transfer'
] )

export const overview = writable( null )
export const list = writable( null )
export const loading = writable( false )
export const error = writable( false )
export const categories = writable( await getCategories() )
export const accounts = writable( await getAccounts() )

async function getCategories () {
    const coll = client.collection( 'categories' );
    return await coll.getFullList( {
        sort: '-name', fields: 'id,name,icon',
    } )
}

async function getAccounts () {
    const coll = client.collection( 'accounts' );
    return await coll.getFullList( {
        sort: '-name', fields: 'id,name,currency',
    } )
}

export async function loadData() {
		loading.set(true)

		await alertOnFailure(async () => {
			const res = await fetch(
				`${PUBLIC_POCKETBASE_URL}/api/overview?budgetId=${auth?.currentBudget}&startOf=${range?.start}&endOf=${range?.end}`,
				{
					headers: {
						Authorization: client.authStore.token,
					},
				},
            );

             loading.set(false)

			if (res.status == 200) {
				overview.set(await res.json()) ;
			}
		});
}
