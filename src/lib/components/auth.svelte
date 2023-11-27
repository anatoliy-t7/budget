<script lang="ts">
	import { client, providerLogin } from '$lib/pocketbase';
	import Button from '$lib/components/ui/button.svelte';
	export let authCollection = 'users';
	export let signup = false;

	const coll = client.collection(authCollection);

	let email: string;
	let password: string;
	let create = false;

	async function submit() {
		if (create) {
			await coll.create({ email, password, passwordConfirm: password });
		}
		await coll.authWithPassword(email, password);
	}
</script>

<div class="flex w-full max-h-screen min-h-screen px-4">
	<div class="lg:w-6/12 relative flex items-center justify-center w-full min-h-screen">
		<div class="justify-centerspace-y-6 flex flex-col">
			<a href="/" class="flex items-center justify-center"> Logo </a>

			<form on:submit|preventDefault={submit} class="grid gap-4">
				{#if signup}
					<input bind:value={email} required type="text" placeholder="email" />

					<input bind:value={password} required type="password" placeholder="password" />

					<button type="submit" on:click={() => (create = true)}>Sign Up</button>
				{:else}
					<input bind:value={email} required type="text" placeholder="email" />

					<input bind:value={password} required type="password" placeholder="password" />

					<Button type="submit" on:click={() => (create = false)}>Sign In</Button>
				{/if}

				{#await coll.listAuthMethods({ $autoCancel: false }) then methods}
					{#each methods.authProviders as p}
						<button type="button" on:click={() => providerLogin(p, coll)}
							>Sign-in with {p.name}</button
						>
					{/each}
				{:catch}
					<!-- pocketbase not working -->
				{/await}
			</form>
		</div>
	</div>
	<div class="lg:flex lg:w-6/12 bg-lime-100 hidden min-h-screen overflow-hidden">
		<!-- <img class="object-cover object-bottom w-full" src="/img/auth-bg.webp" alt="image" /> -->
	</div>
</div>
