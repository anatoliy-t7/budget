import { writable, readable, get } from 'svelte/store';
import { pb } from '$lib/stores/pocketbase';
import { alertOnFailure } from '$lib/utils';
import dayjs from 'dayjs';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
export const monthRange = writable({
	start: dayjs().startOf('month').toISOString(),
	end: dayjs().endOf('month').toISOString(),
});
const range = get(monthRange);

export const transactions = writable(null);
export const transactionType = writable('');
export const transfer = writable('~');
export const types = readable(['expenses', 'income', 'transfer']);
export const overview = writable(null);
export const list = writable(null);
export const loading = writable(false);
export const drawerIsOpen = writable(false);
export const selectedCategory = writable({});
export const transaction = writable({
	id: null,
	amount: null,
	account: null,
	type: 'expenses',
	note: null,
	transfer: null,
	category: null,
	budget: pb.authStore.model?.currentBudget,
	user: pb.authStore.model?.id,
	created: dayjs().toISOString(),
});

export async function getOverview() {
	loading.set(true);

	await alertOnFailure(async () => {
		const res = await fetch(
			`${PUBLIC_POCKETBASE_URL}/api/overview?budgetId=${pb.authStore.model?.currentBudget}&startOf=${range?.start}&endOf=${range?.end}`,
			{
				headers: {
					Authorization: pb.authStore.token,
				},
			},
		);

		loading.set(false);

		if (res.status == 200) {
			overview.set(await res.json());
		}
	});
}

export async function getTransactions(page = 1) {
	loading.set(true);

	const coll = pb.collection('transactions');

	await alertOnFailure(async () => {
		const res = await coll.getList(page, 15, {
			filter: `type ?~ "${get(transactionType)}"
			&& type != "cd"
			&& transfer ${get(transfer)} ""
			&& budget = "${pb.authStore.model?.currentBudget}"
			&& created >= "${range?.start}"
			&& created <= "${range?.end}"`,
			sort: '-created',
			expand: 'category,account,user',
			fields:
				'id,created,amount,type,note,transfer,category,user,budget,account,expand.category.name,expand.category.id,expand.account.name,expand.account.currency,expand.user.email',
		});

		loading.set(false);

		if (res.items?.length) {
			transactions.set(res);
		}
	});
}
