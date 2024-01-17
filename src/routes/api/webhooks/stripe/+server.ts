import { json } from '@sveltejs/kit';
import Stripe from "stripe";
import { pb } from '$lib/stores/pocketbase';

import { SECRET_STRIPE_WEBHOOK_KEY } from '$env/static/private';
import { stripe } from '$lib/utils/stripe';

function toBuffer(ab: ArrayBuffer): Buffer {
	const buf = Buffer.alloc(ab.byteLength);
	const view = new Uint8Array(ab);
	for (let i = 0; i < buf.length; i++) {
		buf[i] = view[i];
	}
	return buf;
}

export async function POST({ request }) {

	const _rawBody = await request.arrayBuffer();
	const body = toBuffer(_rawBody);
	const signature = request.headers.get('stripe-signature') as string;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, SECRET_STRIPE_WEBHOOK_KEY);

	} catch (error: any) {
		return json({ status: 400, message: `Webhook Error: ${error.message}` })
	}

	const session = event.data.object as Stripe.Invoice;

	let subscription = null;
	let customer = null;
	let userRecord = null;

	switch (event.type) {
		case "invoice.paid":
			console.log('invoice.paid');

			// TODO need to create special user for stripe
			await pb.collection('users').authWithPassword('anatoliy.darma@gmail.com', 'anatoliy.darma@gmail.com');

			subscription = await stripe.subscriptions.retrieve(session.subscription as string);

			customer = await stripe.customers.retrieve(session.customer as string);

			userRecord = await pb.collection('users').getFirstListItem(`email = "${customer?.email}"`);

			if (userRecord) {
				const stripeData = {
					userId: userRecord.id,
					subscriptionId: session.subscription,
					customerId: session.customer,
					productId: subscription.plan?.product,
					currentPeriodEnd: new Date(subscription.current_period_end * 1000),
					trial_end: subscription.trial_end,
					unlimited: 0,
				}

				await pb.collection('budgets').update(userRecord.budget, { stripe: stripeData });
			} else {
				return json({ status: 404, message: `User not found: ${customer?.email}` })
			}

			break;
		case "customer.subscription.paused":
			// when a free trial ends without a payment method
			console.log('customer.subscription.paused');

			await pb.collection('users').authWithPassword('anatoliy.darma@gmail.com', 'anatoliy.darma@gmail.com');

			subscription = await stripe.subscriptions.retrieve(session.subscription as string);

			customer = await stripe.customers.retrieve(session.customer as string);

			userRecord = await pb.collection('users').getFirstListItem(`email = "${customer?.email}"`);

			if (userRecord) {
				const stripeData = {
					userId: userRecord.id,
					subscriptionId: session.subscription,
					customerId: session.customer,
					productId: subscription.plan?.product,
					currentPeriodEnd: new Date(subscription.current_period_end * 1000),
					trial_end: subscription.trial_end,
					unlimited: 0,
				}

				await pb.collection('budgets').update(userRecord.budget, { stripe: stripeData });
			} else {
				return json({ status: 404, message: `User not found: ${customer?.email}` })
			}
			break;
		case "customer.subscription.deleted":
			// Sent when a customer’s subscription ends.
			console.log('customer.subscription.deleted');

			await pb.collection('users').authWithPassword('anatoliy.darma@gmail.com', 'anatoliy.darma@gmail.com');

			customer = await stripe.customers.retrieve(session.customer as string);

			userRecord = await pb.collection('users').getFirstListItem(`email = "${customer?.email}"`);

			if (userRecord) {
				const stripeData = {
					userId: userRecord.id,
					subscriptionId: null,
					customerId: session.customer,
					productId: null,
					currentPeriodEnd: Date.now(),
					trial_end: null,
					unlimited: 0,
				}

				await pb.collection('budgets').update(userRecord.budget, { stripe: stripeData });
			} else {
				return json({ status: 404, message: `User not found: ${customer?.email}` })
			}
			break;
	}
	return json({ status: 200, message: 'OK' })
}
