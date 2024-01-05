import { writable, readable } from 'svelte/store';
import { pb } from '$lib/stores/pocketbase';
export const CURRENCY = readable(['USD', 'EUR', 'INR']);

export const loading = writable(false);
export const categories = writable(null);
export const accounts = writable(null);
export const budget = writable(null);
export const fileToken = writable('');

export async function getCategories() {
	const coll = pb.collection('categories');
	const res = await coll.getFullList({
		filter: `budget = "${pb.authStore.model?.budget}" || budget = ""`,
		sort: '+name',
		fields: 'id,name,icon,type,popular,budget',
	});
	categories.set(res);
}

export async function getAccounts() {
	const coll = pb.collection('accounts');
	const res = await coll.getFullList({
		filter: `budget = "${pb.authStore.model?.budget}"`,
		sort: '-name',
		fields: 'id,name,currency',
	});
	accounts.set(res);
}

export async function getBudget() {
	const coll = pb.collection('budgets');
	const res = await coll.getOne(pb.authStore.model?.budget, {
		sort: '-name',
		fields: 'id,name,defaultCurrency',
	});
	budget.set(res);
}

export async function resetAll() {
	budget.set(null);
	categories.set(null);
	accounts.set(null);
	fileToken.set('');
}

/**
 * @param {string | URL | Request} url
 */
export async function fetch(url) {
	const loading = writable(false);
	const error = writable(false);
	const data = writable({});

	async function get() {
		loading.set(true);
		error.set(false);
		try {
			const response = await fetch(url);
			data.set(await response.json());
		} catch (e) {
			error.set(e);
		}
		loading.set(false);
	}

	get();

	return [data, loading, error, get];
}
