import { json } from '@sveltejs/kit';
import * as billing from '$lib/server/billing';

export async function GET({ url, request }) {
	const token = request.headers.get('Authorization') || '';
	const userId = url.searchParams.get('userId') || '';
	const priceId = url.searchParams.get('priceId') || '';

	const checkout = await billing.createCheckout(userId, priceId, token);

	return json({ status: 200, checkout });
}
