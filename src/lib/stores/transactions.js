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
export const transactions = writable(null);

export async function getCategories() {
	const coll = client.collection('categories');
	const res = await coll.getFullList({
		sort: '-name',
		fields: 'id,name,icon,type,popular,budget',
	});
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

export async function getTransactions(page = 1, type = '', transfer = '~') {
	loading.set(true);

	const coll = client.collection('transactions');

	await alertOnFailure(async () => {
		const res = await coll.getList(page, 15, {
			filter: `type ?~ "${type}" && type != "cd" && transfer ${transfer} ""`,
			sort: '-created',
			expand: 'category,account,user',
			fields:
				'created,amount,type,note,transfer,expand.category.name,expand.account.name,expand.account.currency,expand.user.email',
		});

		loading.set(false);

		if (res.items?.length) {
			transactions.set(res);
		}
	});
}
