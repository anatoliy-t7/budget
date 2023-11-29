import { writable, readable, readonly, derived } from 'svelte/store';
import { client } from '$lib/pocketbase';

export const types = readable([
    'expenses', 'income', 'transfer'
])

export const loading = writable(false)
export const error = writable(false)
export const categories = writable(await getCategories())
export const accounts = writable(await getAccounts())

async function getCategories() {
    // loading.set(true)
    const coll = client.collection('categories');
    return await coll.getFullList({
        sort: '-name', fields: 'id,name,icon',
    })
}

async function getAccounts() {
    // loading.set(true)
    const coll = client.collection('accounts');
    return await coll.getFullList({
        sort: '-name', fields: 'id,name',
    })
}
