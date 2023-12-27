import { writable, readable, get } from 'svelte/store';
import { client } from '$lib/stores/pocketbase';
import { alertOnFailure } from '$lib/utils';
import dayjs from 'dayjs';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
export const monthRange = writable({
	start: dayjs().startOf('month').toISOString(),
	end: dayjs().endOf('month').toISOString(),
});

const range = get(monthRange);

export const types = readable(['expenses', 'income', 'transfer']);

export const overview = writable(null);
export const list = writable(null);
export const loading = writable(false);
export const error = writable(false);
export const categories = writable(null);
export const accounts = writable(null);

export async function getCategories() {
	const coll = client.collection('categories');
	const res = await coll.getFullList({
		sort: '-name',
		fields: 'id,name,icon,type,popular,budget',
	});
	console.log(res);
	categories.set(res);
}

export async function getAccounts() {
	const coll = client.collection('accounts');
	const res = await coll.getFullList({
		sort: '-name',
		fields: 'id,name,currency',
	});

	accounts.set(res);
}

export async function getOverview(currentBudget) {
	loading.set(true);

	await alertOnFailure(async () => {
		const res = await fetch(
			`${PUBLIC_POCKETBASE_URL}/api/overview?budgetId=${currentBudget}&startOf=${range?.start}&endOf=${range?.end}`,
			{
				headers: {
					Authorization: client.authStore.token,
				},
			},
		);

		loading.set(false);

		if (res.status == 200) {
			overview.set(await res.json());
		}
	});
}
