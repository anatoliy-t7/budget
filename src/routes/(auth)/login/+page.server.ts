import { redirect, fail } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { userSchema } from '$lib/zod';

const loginSchema = userSchema.pick({
	email: true,
	password: true
});

export const load = async ({ locals, url }) => {

	if (locals.pb.authStore.isValid) {
		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo) {
			throw redirect(302, `/${redirectTo.slice(1)}`);
		}
		throw redirect(302, '/');
	}

	const form = await superValidate(loginSchema);

	return { form };
};

export const actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, loginSchema);

		if (!form.valid) return fail(400, { form });

		try {
			await locals.pb.collection('users').authWithPassword(form.data.email, form.data.password);
		} catch (e: any) {
			console.error(e);
			return setError(form, 'password', e.response.message);
		}

		throw redirect(303, '/dashboard');
	}
};
