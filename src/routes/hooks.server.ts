import { redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { pb } from '$lib/server/pocketbase';
import { PUBLIC_DOMAIN } from '$env/static/public';

export const handleMiddleware = async ({ event, resolve }) => {

	// Load the authStore from the cookie
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	try {
		// Check if the user is authenticated
		if (pb.authStore.isValid) {
			// Refresh the user's authentication
			await pb.collection('users').authRefresh();

			// Set the user in the locals object
			event.locals.user = structuredClone(pb.authStore.model);
		}
	} catch (err) {
		// Clear the authStore if there is an error
		pb.authStore.clear();
	}

	if (event.url.pathname.startsWith('/dashboard') && event.locals.user?.role === 'guest') {
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
	response.headers.append('set-cookie', pb.authStore.exportToCookie({ secure: isProd, sameSite: 'Lax' }));
	return response;
};

export const handle = sequence(handleMiddleware);

export const handleError = ({ error, event }) => {
	console.error(error);
	return {
		message: "An unexpected error occurred. We're working on it."
	};
};
