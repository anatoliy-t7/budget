import { writable, get } from 'svelte/store';
import { authModel, pb } from '$lib/stores/pocketbase';
import { PUBLIC_DOMAIN } from '$env/static/public';
export const loading = writable(false);
export const categories = writable(null);
export const accounts = writable(null);
export const budget = writable(null);
export const fileToken = writable('');
export const editProfile = writable(false);
export const billingPortalUrl = writable(null);

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
	const auth = get(authModel);
	if (auth && auth?.expand?.budget) {
		budget.set(auth.expand.budget);
	}
}

export async function resetAll() {
	budget.set(null);
	categories.set(null);
	accounts.set(null);
	fileToken.set('');
}

export async function getBillingPortalUrl() {
	await fetch(`${PUBLIC_DOMAIN}/api/stripe/billing-portal?budgetId=${pb.authStore.model?.budget}`)
		.then((res) => res.json())
		.then((res) => {
			billingPortalUrl.set(res.url);
		});
}

// export async function fetchData(url) {
// 	const loading = writable(false);
// 	const error = writable(false);
// 	const data = writable({});

// 	async function get() {
// 		loading.set(true);
// 		error.set(false);
// 		try {
// 			const response = await fetch(url);
// 			data.set(await response.json());
// 		} catch (e) {
// 			error.set(e);
// 		}
// 		loading.set(false);
// 	}

// 	get();

// 	return [data, loading, error, get];
// }
