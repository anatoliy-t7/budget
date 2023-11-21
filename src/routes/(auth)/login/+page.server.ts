import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	if (locals.pb.authStore.isValid) {
		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo) {
			throw redirect(302, `/${redirectTo.slice(1)}`);
		}
		throw redirect(302, '/');
	}
};

export const actions = {
	default: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData()) as {
			email: string;
			password: string;
		};

		try {
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
		} catch (e) {
			console.error(e);
			throw e;
		}

		throw redirect(303, '/');
	}
};
