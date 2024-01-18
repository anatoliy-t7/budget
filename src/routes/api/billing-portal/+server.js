import { json } from '@sveltejs/kit';
import { PUBLIC_DOMAIN } from '$env/static/public';
import { stripe } from '$lib/server/stripe';
import { pb } from '$lib/stores/pocketbase';

export async function GET({ url }) {
	const ledgerId = url.searchParams.get('ledgerId') || '';

	const ledger = await pb.collection('ledgers').getOne(ledgerId, {
		fields: 'id,stripe',
	});

	let billingPortal = {
		url: null,
	};

	if (ledger.stripe?.customerId) {
		billingPortal = await stripe.billingPortal.sessions.create({
			customer: ledger.stripe?.customerId,
			return_url: absoluteURL('/'),
		});
	} else {
		billingPortal.url = null;
	}

	return json({ status: 200, url: billingPortal.url });
}

/**
 * Description placeholder
 * @date 1/17/2024 - 8:25:22 PM
 *
 * @param {*} path
 * @returns {*}
 */
function absoluteURL(path) {
	return new URL(path, PUBLIC_DOMAIN).toString();
}
