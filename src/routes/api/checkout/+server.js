import { json } from '@sveltejs/kit';
import * as billing from '$lib/server/billing';

export async function GET({ url, request }) {
	const token = request.headers.get('Authorization') || '';
	const userId = url.searchParams.get('userId') || '';
	const priceId = url.searchParams.get('priceId') || '';
	const access = Number(url.searchParams.get('access'));

	const checkout = await billing.createCheckout(userId, priceId, access);

	return json({ status: 200, clientSecret: checkout.client_secret });
}
