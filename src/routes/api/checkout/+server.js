import { json } from '@sveltejs/kit';
import * as billing from '$lib/server/billing';

export async function GET({ url }) {
	const ledgerId = url.searchParams.get('ledgerId') || '';
	const planId = url.searchParams.get('plan');

	const checkout = await billing.createCheckout(ledgerId, planId);

	return json({ status: 200, url: checkout.url });
}
