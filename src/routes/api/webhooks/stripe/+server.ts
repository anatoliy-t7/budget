import { json } from '@sveltejs/kit';
import Stripe from "stripe";

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
	// Extract the data from the event.
	const data: Stripe.Event.Data = event.data;

	switch (event.type) {
		case "invoice.paid":
			console.log('invoice.paid');

			const subscription: Stripe.Subscription = await stripe.subscriptions.retrieve(session.subscription as string);
			const customer = await stripe.customers.retrieve(session.customer as string);
			// console.log('customer: ', customer);

			// TODO find user with budget by email from a customer. Save data in Json field of budget

			const stripeData = {
				//userId: session.metadata.userId,
				stripeSubscriptionId: session.subscription,
				stripeCustomerId: session.customer,
				stripePriceId: subscription.plan.id,
				stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
			}
			break;
		case "customer.subscription.paused":
			// when a free trial ends without a payment method

			break;
		case "customer.subscription.deleted":
			// Sent when a customer’s subscription ends.

			break;
	}
	return json({ status: 200, message: 'OK' })
}
