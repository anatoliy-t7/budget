import { fail, redirect } from '@sveltejs/kit';
import { userSchema } from '$lib/zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { pb } from '$lib/server/pocketbase';

const signUpSchema = userSchema.pick({
	email: true,
	password: true,
	passwordConfirm: true
});

export const load = async (event: any) => {
	if (pb.authStore.isValid) {
		throw redirect(303, '/');
	}

	const form = await superValidate(event, signUpSchema);
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, signUpSchema);

		// console.log('form', form);
		form.data.passwordConfirm = form.data.password;
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await pb.collection('users').create(form.data);

			await pb
				.collection('users')
				.authWithPassword(form.data.email, form.data.password);
			await pb.collection('users').requestVerification(form.data.email);
		} catch (err) {
			console.error(err);

			return setError(form, 'email', err.response.message);
		}

		return { form };
	}
};
