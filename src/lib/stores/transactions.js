import { writable, readable, get, readonly } from 'svelte/store';
import { accounts } from '$lib/stores/main';
import { pb } from '$lib/stores/pocketbase';
import { alertOnFailure } from '$lib/utils/utils';
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
export const totalOverview = writable(null);
export const list = writable(null);
export const loading = writable(false);
export const isEditOpen = writable(false);

export const isViewOpen = writable(false);
export const selectedCategory = writable({});
export const tags = writable([]);
export const totalAmountsByCategories = writable([]);
export const rangeTags = writable([]);
export const filterTag = writable('');
export const filterCategory = writable('');
export const monthIsClosed = writable(false);
export const defaultCurrency = writable('');
export const exchangeRate = writable(null);
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
	files: null,
	tags: [],
});

export async function onOpenEdit() {
	if (!get(tags).length) {
		await getTags();
	}

	isEditOpen.set(true);
	transaction.subscribe((value) => {
		const acs = get(accounts);
		value.account = acs[0]?.id;
		value.transfer = acs.length > 1 ? acs[1]?.id : acs[0]?.id;
	});
}

export async function getOverview() {
	loading.set(true);

	if (!pb.authStore.model?.currentBudget) {
		await pb.collection('users').authRefresh();
	}

	// await alertOnFailure(async () => {
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
		const data = await res.json();
		overview.set(data.data);
		defaultCurrency.set(data.defaultCurrency);

		await getCurrency(data.defaultCurrency);
		await getTotalBalance(data);
	}
	// });
}

/**
 * @param {{ data: any[]; defaultCurrency: any; }} data
 */
export async function getTotalBalance(data) {
	if (data) {
		let total = {
			income: 0,
			expenses: 0,
			balance: 0,
		};
		Object.values(data.data)?.forEach((c) => {
			if (c.currency === data.defaultCurrency) {
				total.income += c.income;
				total.expenses += c.expenses;
				total.balance += c.balance;
			} else {
				const rate = getRateOfDefaultCurrency(c.currency);

				total.income += c.income / Number(rate[1]);
				total.expenses += c.expenses / Number(rate[1]);
				total.balance += c.balance / Number(rate[1]);
			}
		});
		// @ts-ignore
		totalOverview.set({
			income: total.income.toFixed(0),
			expenses: total.expenses.toFixed(0),
			balance: total.balance.toFixed(0),
		});
	}
}

export const getRateOfDefaultCurrency = (currency) => {
	const exRate = get(exchangeRate);
	const defCurrency = get(defaultCurrency);
	return Object.entries(exRate[defCurrency])?.find((r) => {
		if (r[0] === currency) {
			return r;
		}
	});
};

export async function getTransactions(page = 1) {
	loading.set(true);

	await getTypeClosedTransactions();

	const coll = pb.collection('transactions');

	await alertOnFailure(async () => {
		const res = await coll.getList(page, 12, {
			filter: `type ?~ "${get(transactionType)}"
			&& type != "opened"
			&& transfer ${get(transfer)} ""
			&& budget = "${pb.authStore.model?.currentBudget}"
			&& created >= "${range?.start}"
			&& created <= "${range?.end}"
			&& tags ~ "${get(filterTag)}"
			&& category ~ "${get(filterCategory)}"`,
			sort: '-created',
			expand: 'category,account,user,files',
			fields:
				'id,created,amount,type,note,tags,transfer,category,user,budget,account,files,expand.category.name,expand.category.id,expand.category.icon,expand.account.name,expand.account.currency,expand.user.email,expand.user.name,expand.files.id,expand.files.files',
		});

		loading.set(false);

		transactions.set(res);

		await getTagsRange();
	});
}

export async function getTypeClosedTransactions() {
	const coll = pb.collection('transactions');

	const res = await coll.getFullList({
		filter: `type = "closed"
			&& budget = "${pb.authStore.model?.currentBudget}"
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

export async function getTagsRange() {
	const res = await fetch(
		`${PUBLIC_POCKETBASE_URL}/api/tags/range?budgetId=${pb.authStore.model?.currentBudget}&startOf=${range?.start}&endOf=${range?.end}`,
		{
			headers: {
				Authorization: pb.authStore.token,
			},
		},
	);

	if (res.status == 200) {
		const data = await res.json();
		rangeTags.set(data);
	}
}

export async function getTotalAmountsByCategories() {
	const res = await fetch(
		`${PUBLIC_POCKETBASE_URL}/api/categories/range?budgetId=${pb.authStore.model?.currentBudget}&startOf=${range?.start}&endOf=${range?.end}`,
		{
			headers: {
				Authorization: pb.authStore.token,
			},
		},
	);

	if (res.status == 200) {
		const data = await res.json();
		totalAmountsByCategories.set(data);
	}
}

export async function getTags() {
	const res = await fetch(
		`${PUBLIC_POCKETBASE_URL}/api/tags?budgetId=${pb.authStore.model?.currentBudget}`,
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

/**
 * @param {string} currency
 */
export async function getCurrency(currency) {
	if (currency) {
		let url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency?.toLowerCase()}.json`;

		try {
			const res = await fetch(url);

			const data = await res.json();
			exchangeRate.set(data);
		} catch (e) {
			console.error(e);
		}
	}
}

export async function reset() {
	transaction.set({
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
		files: null,
		tags: [],
	});

	selectedCategory.set({});
}

export async function resetAll() {
	reset();
	monthIsClosed.set(false);
	filterCategory.set('');
	filterTag.set('');
	tags.set([]);
	rangeTags.set([]);
	selectedCategory.set([]);
	isViewOpen.set(false);
	isEditOpen.set(false);
	list.set(null);
	overview.set(null);
	transactionType.set('');
	transactions.set(null);
}
