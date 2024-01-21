import { writable, get } from 'svelte/store';
import { authModel, pb } from '$lib/stores/pocketbase';

export const loading = writable(false);
export const categories = writable(null);
export const accounts = writable(null);
export const ledger = writable(null);
export const fileToken = writable('');
export const editProfile = writable(false);
export const billingPortalUrl = writable(null);

export async function getCategories() {
	const coll = pb.collection('categories');

	const res = await coll.getFullList({
		filter: `ledger = "${pb.authStore.model?.ledger}" || ledger = ""`,
		sort: '+name',
		fields: 'id,name,icon,type,popular,ledger',
	});

	categories.set(res);
}

export async function getAccounts() {
	const coll = pb.collection('accounts');
	const res = await coll.getFullList({
		filter: `ledger = "${pb.authStore.model?.ledger}"`,
		sort: '-name',
		fields: 'id,name,currency',
	});
	accounts.set(res);
}

export async function getBudget() {
	const auth = get(authModel);
	if (auth && auth?.expand?.ledger) {
		ledger.set(auth.expand.ledger);
	}
}

export async function resetAll() {
	ledger.set(null);
	categories.set(null);
	accounts.set(null);
	fileToken.set('');
}
