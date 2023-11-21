// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		type PocketBase = import('pocketbase').default;

		interface Locals {
			pb?: PocketBase;
			user?: Record<string, T>;
		}
		// interface PageData {}
		// interface Platform {}

		interface Error {
			code?: string;
		}
	}
}

export { };