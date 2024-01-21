/**
 * @param {string} currency
 */
export async function getCurrency(currency) {
	let url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency?.toLowerCase()}.json`;

	const res = await fetch(url);
	return await res.json();
}

/**
 * @param {{collection: (arg0: string) => {(): any;new (): any;getFullList: {(arg0: {filter: string;sort: string;fields: string;}): any;new (): any;};};}} pb
 * @param {string} [ledgerId]
 */
export async function getCategories(pb, ledgerId) {
	if (!ledgerId) return [];
	return await pb.collection('categories').getFullList({
		filter: `ledger = "${ledgerId}" || ledger = ""`,
		sort: '+name',
		fields: 'id,name,icon,type,popular,ledger',
	});
}

/**
 * @param {string} [ledgerId]
 * @param {{ collection: (arg0: string) => { (): any; new (): any; getFullList: { (arg0: { filter: string; sort: string; fields: string; }): any; new (): any; }; }; }} pb
 */
export async function getAccounts(pb, ledgerId) {
	if (!ledgerId) return [];
	return await pb.collection('accounts').getFullList({
		filter: `ledger = "${ledgerId}"`,
		sort: '-name',
		fields: 'id,name,currency',
	});
}

export const serializeNonPOJOs = (obj) => {
	return JSON.parse(JSON.stringify(obj));
};
