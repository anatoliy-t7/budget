import { getAccounts, getCategories } from '$lib/server/main';

export async function load({ locals }) {
	let pb = locals.pb;
	const ledgerId = locals?.user?.ledger;
	return {
		categories: await getCategories(pb, ledgerId),
		accounts: await getAccounts(pb, ledgerId),
	};
}
