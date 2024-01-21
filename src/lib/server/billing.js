import { PUBLIC_DOMAIN, PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { stripe } from '$lib/server/stripe';
import PocketBase from 'pocketbase';
const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

export async function createCheckout(userId, priceId, access) {
	const user = await pb.collection('users').getOne(userId, {});

	const ledger = await pb.collection('ledgers').getOne(user.ledger, {
		fields: 'id,stripe',
	});

	let subscription_data;

	if (access === 1) {
		subscription_data = {
			trial_settings: {
				end_behavior: {
					missing_payment_method: 'cancel',
				},
			},
			trial_period_days: 30,
			metadata: {
				ledgerId: ledger.id,
				userId: user.id,
			},
		};
	} else {
		subscription_data = {
			metadata: {
				ledgerId: ledger.id,
				userId: user.id,
			},
		};
	}

	// @ts-expect-error: stripe
	return await stripe.checkout.sessions.create({
		ui_mode: 'embedded',
		return_url: absoluteURL('/welcome?sessionId={CHECKOUT_SESSION_ID}'),
		currency: 'usd',
		mode: 'subscription',
		customer_email: user.email,
		client_reference_id: user.id,
		subscription_data,
		payment_method_collection: 'if_required',
		line_items: [
			{
				price: priceId,
				quantity: 1,
			},
		],
	});
}

export async function syncCheckout(sessionId) {
	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId);
		await syncSubscription(session);

		return true;
	} catch (error) {
		console.error();
		return false;
	}
}

export async function syncSubscription(session) {
	let subscription = null;
	let userRecord = null;

	subscription = await stripe.subscriptions.retrieve(session.subscription);

	const customer = await stripe.customers.retrieve(session.customer);

	userRecord = await pb.collection('users').getFirstListItem(`email = "${customer?.email}"`);

	const stripeData = {
		userId: userRecord.id,
		subscriptionId: session.subscription,
		customerId: session.customer,
		productId: subscription.plan?.product,
		currentPeriodEnd: new Date(subscription.current_period_end * 1000),
		trial_end: subscription.trial_end,
		unlimited: 0,
	};

	await pb.collection('ledgers').update(userRecord.ledger, { stripe: stripeData });
}

export async function getBillingPortalUrl(customerId) {
	let billingPortal = {
		url: null,
	};
	console.log('customerId', customerId);
	if (customerId) {
		billingPortal = await stripe.billingPortal.sessions.create({
			customer: customerId,
			return_url: PUBLIC_DOMAIN,
		});
	} else {
		billingPortal.url = null;
	}

	return billingPortal.url;
}

function absoluteURL(path) {
	return new URL(path, PUBLIC_DOMAIN).toString();
}
