import { redirect } from '@sveltejs/kit';
import { pb } from '$lib/server/pocketbase';
import { PUBLIC_DOMAIN } from '$env/static/public';

export const handle = async ({ event, resolve }) => {

	event.locals.pb = pb

	// Load the authStore from the cookie
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	try {
		// Check if the user is authenticated
		if (event.locals.pb.authStore.isValid) {
			// Refresh the user's authentication
			await event.locals.pb.collection('users').authRefresh();

			// Set the user in the locals object
			event.locals.user = structuredClone(pb.authStore.model);
		}
	} catch (err) {
		// Clear the authStore if there is an error
		event.locals.pb.authStore.clear();
	}

	console.log(event.url.pathname.startsWith('/dashboard') && event.locals.pb.authStore.isValid);

	if (event.url.pathname.startsWith('/dashboard') && !event.locals.pb.authStore.isValid) {
		throw redirect(303, '/login');
	}

	if (event.url.pathname.startsWith('/api')) {
		response.headers.append('Access-Control-Allow-Origin', PUBLIC_DOMAIN);

		// Required for CORS to work
		if (event.request.method === 'OPTIONS') {
			response.headers.append(
				'Access-Control-Allow-Methods',
				'GET, POST, PUT, DELETE, PATCH, OPTIONS'
			);
			response.headers.append('Access-Control-Allow-Headers', PUBLIC_DOMAIN);
		}
	}

	const response = await resolve(event);

	const isProd = process.env.NODE_ENV === 'production' ? true : false;
	response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: isProd, sameSite: 'Lax' }));

	return response;
};

export const handleError = ({ error, event }) => {
	console.error(error);
	return {
		message: "An unexpected error occurred. We're working on it."
	};
};
