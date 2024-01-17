import { json } from '@sveltejs/kit';
import { PUBLIC_DOMAIN } from '$env/static/public';
import { stripe } from '$lib/utils/stripe';
import { pb } from '$lib/stores/pocketbase';

export async function GET({ url, request }) {
	const budgetId = url.searchParams.get('budgetId') || '';

	const record = await pb.collection('budgets').getOne(budgetId, {
		fields: 'id,stripe',
	});

	let billingPortal = {
		url: null,
	};

	if (record.stripe?.customerId) {
		billingPortal = await stripe.billingPortal.sessions.create({
			customer: record.stripe?.customerId,
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
