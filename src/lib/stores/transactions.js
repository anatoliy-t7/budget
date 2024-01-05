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

export const types = readable(['expenses', 'income', 'transfer']);
export const transactions = writable(null);
export const transactionType = writable('');
export const transfer = writable('~');
export const overview = writable(null);
export const list = writable(null);
export const loading = writable(false);
export const openForEdit = writable(false);
export const openForView = writable(false);
export const selectedCategory = writable({});
export const tags = writable([]);
export const filterTag = writable('');
export const filterCategory = writable('');
export const monthIsClosed = writable(false);

export async function resetAll() {
	monthIsClosed.set(false);
	filterCategory.set('');
	filterTag.set('');
	tags.set([]);
	selectedCategory.set([]);
	openForView.set(false);
	openForEdit.set(false);
	list.set(null);
	overview.set(null);
	transactionType.set('');
	transactions.set(null);
}
export const transaction = writable({
	id: null,
	amount: null,
	account: null,
	type: 'expenses',
	note: null,
	transfer: null,
	category: null,
	budget: pb.authStore.model?.budget,
	user: pb.authStore.model?.id,
	created: dayjs().toISOString(),
	files: null,
});

export async function reset() {
	transaction.set({
		id: null,
		amount: null,
		account: null,
		type: 'expenses',
		note: null,
		transfer: null,
		category: null,
		budget: pb.authStore.model?.budget,
		user: pb.authStore.model?.id,
		created: dayjs().toISOString(),
		files: null,
	});

	selectedCategory.set({});
}

export async function getOverview() {
	loading.set(true);

	if (!pb.authStore.model?.budget) {
		await pb.collection('users').authRefresh();
	}

	await alertOnFailure(async () => {
		const res = await fetch(
			`${PUBLIC_POCKETBASE_URL}/api/overview?budgetId=${pb.authStore.model?.budget}&startOf=${range?.start}&endOf=${range?.end}`,
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

	await getTypeClosedTransactions();

	const coll = pb.collection('transactions');

	await alertOnFailure(async () => {
		const res = await coll.getList(page, 12, {
			filter: `type ?~ "${get(transactionType)}"
			&& type != "opened"
			&& transfer ${get(transfer)} ""
			&& budget = "${pb.authStore.model?.budget}"
			&& created >= "${range?.start}"
			&& created <= "${range?.end}"
			&& note ~ "${get(filterTag)}"
			&& category ~ "${get(filterCategory)}"`,
			sort: '-created',
			expand: 'category,account,user,files',
			fields:
				'id,created,amount,type,note,transfer,category,user,budget,account,files,expand.category.name,expand.category.id,expand.account.name,expand.account.currency,expand.user.email,expand.user.name,expand.files.id,expand.files.files',
		});

		loading.set(false);

		transactions.set(res);

		await getTags();
	});
}

export async function getTypeClosedTransactions() {
	const coll = pb.collection('transactions');

	const res = await coll.getFullList({
		filter: `type = "closed"
			&& budget = "${pb.authStore.model?.budget}"
			&& created >= "${range?.start}"
			&& created <= "${range?.end}"`,
		fields: 'id',
	});

	if (res.length > 0) {
		monthIsClosed.set(true);
	} else {
		monthIsClosed.set(false);
	}
}

export async function getTags() {
	const res = await fetch(
		`${PUBLIC_POCKETBASE_URL}/api/tags?budgetId=${pb.authStore.model?.budget}&startOf=${range?.start}&endOf=${range?.end}`,
		{
			headers: {
				Authorization: pb.authStore.token,
			},
		},
	);

	if (res.status == 200) {
		tags.set(await res.json());
	}
}
