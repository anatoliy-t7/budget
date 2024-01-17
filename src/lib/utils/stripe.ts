import Stripe from 'stripe';
import { SECRET_STRIPE_KEY, STRIPE_API_VERSION } from '$env/static/private';

export const stripe = new Stripe(SECRET_STRIPE_KEY, {
    apiVersion: STRIPE_API_VERSION,
    httpClient: Stripe.createFetchHttpClient()
});
