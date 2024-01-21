import { json } from '@sveltejs/kit';
import * as billing from '$lib/server/billing';

export async function GET({ url }) {
	const sessionId = url.searchParams.get('sessionId') || '';

	const res = await billing.syncCheckout(sessionId);

	return json({ status: 200, success: res });
}
