import { stripe } from '$lib/server/stripe';
import { env } from '$env/dynamic/private';
import { pb } from '$lib/stores/pocketbase';
import { PUBLIC_DOMAIN } from '$env/static/public';

/**
 * @param {string} userId
 * @param {string} priceId
 * @param {string} token
 */
export async function createCheckout(userId, priceId, token) {
	pb.authStore.save(token, null);

	const user = await pb.collection('users').getOne(userId, {});

	const ledger = await pb.collection('ledgers').getOne(user.ledger, {
		fields: 'id,stripe',
	});

	const metadata = {
		ledgerId: ledger.id,
		userId: user.id,
	};

	return stripe.checkout.sessions.create({
		success_url: absoluteURL('/?checkout_session_id={CHECKOUT_SESSION_ID}'),
		cancel_url: absoluteURL('/'),
		currency: 'usd',
		mode: 'subscription',
		customer_email: user.email,
		client_reference_id: user.id,
		metadata,
		subscription_data: {
			metadata,
		},
		line_items: [
			{
				price: priceId,
				quantity: 1,
			},
		],
	});
}

/**
 * @param {string} sessionId
 */
export async function syncCheckout(sessionId) {
	const checkout = await stripe.checkout.sessions.retrieve(sessionId);

	return syncSubscription(checkout.subscription);
}

/**
 * @param {string | import("stripe").Stripe.Subscription | null} subscriptionId
 */
export async function syncSubscription(subscriptionId) {
	const subscription = await stripe.subscriptions.retrieve(subscriptionId);
	const { userId } = subscription.metadata;

	const item = subscription.items.data[0];
	const priceId = item.price.id;
	const plan = await plans.getBy({ priceId });

	await users.update(userId, {
		customerId: subscription.customer,
		subscriptionId: subscription.id,
		status: subscription.status.toUpperCase(),
		planId: plan.id,
	});
}

/**
 * @param {string | URL} path
 */
function absoluteURL(path) {
	return new URL(path, PUBLIC_DOMAIN).toString();
}
