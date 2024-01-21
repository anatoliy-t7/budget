import { json } from '@sveltejs/kit';
import { getBillingPortalUrl } from '$lib/server/billing';

export async function GET({ url }) {
	const customerId = url.searchParams.get('customerId') || '';

	const billingPortalUrl = await getBillingPortalUrl(customerId);

	return json({ status: 200, url: billingPortalUrl });
}
