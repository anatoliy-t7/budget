import { dev } from '$app/environment';
import { authModel, pb } from '$lib/stores/pocketbase';

pb.authStore.loadFromCookie(document.cookie);
pb.authStore.onChange(() => {
	authModel.set(pb.authStore.model);
	document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
}, true);

export const handleError = ({ error, event }) => {
	if (dev) {
		console.error(error);
	}

	return {
		message: "An unexpected error occurred. We're working on it!",
	};
};
