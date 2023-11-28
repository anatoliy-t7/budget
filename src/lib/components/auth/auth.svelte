<script lang="ts">
	import { client, providerLogin } from '$lib/pocketbase';
	import Button from '$lib/components/ui/button.svelte';
	import { alertOnFailure } from '$lib/utils';
	import GoogleIcon from '$lib/components/ui/google-icon.svelte';
	import Logo from '$lib/components/ui/logo.svelte';

	export let authCollection = 'users';
	export let signup = false;
	let resetPassword = false;

	const coll = client.collection(authCollection);

	let email: string;
	let password: string;
	$: disabled = !email?.length && !password?.length;

	async function submit() {
		alertOnFailure(async () => {
			if (signup) {
				await coll.create({ email, password, passwordConfirm: password });
			}
			await coll.authWithPassword(email, password);
		});
	}
</script>

<div class="flex w-full max-h-screen min-h-screen px-4">
	<div class="lg:w-6/12 relative flex items-center justify-center w-full min-h-screen">
		<div class="w-80 flex flex-col justify-center space-y-8">
			<h1 class="text-3xl font-medium">
				{#if signup}
					Sign up for an Account
				{:else}
					Sign in to Your Account
				{/if}
			</h1>
			<form on:submit|preventDefault={submit} class="grid gap-5">
				{#await coll.listAuthMethods({ $autoCancel: false }) then methods}
					{#each methods.authProviders as p}
						<Button theme={'empty'} type="button" on:click={() => providerLogin(p, coll)}>
							{#if p.name === 'google'}
								<GoogleIcon />
							{/if}
							{#if signup}
								Sign up with
							{:else}
								Sign in with
							{/if}
							<span class="-ml-1 capitalize">{p.name}</span>
						</Button>
					{/each}
				{:catch}
					<!-- pocketbase not working -->
				{/await}

				<div class="relative">
					<div class="absolute inset-0 flex items-center" aria-hidden="true">
						<div class="border-slate-300 w-full border-t"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="px-2 font-medium text-gray-400 bg-white"> or </span>
					</div>
				</div>

				<label class="block space-y-1 text-sm font-medium">
					<span> Email Address</span>

					<input
						bind:value={email}
						autocapitalize="off"
						autocorrect="off"
						autofocus
						pattern="[^@]+@[^@]+.[a-zA-Z]"
						required
						type="email"
					/>
				</label>

				<label class="block space-y-1 text-sm font-medium">
					<span>Password</span>
					<input bind:value={password} required type="password" />
				</label>
				<div class="text-cyan-600 flex items-center justify-between text-sm">
					<button
						on:click={() => (resetPassword = !resetPassword)}
						type="button"
						class="hover:text-cyan-700 transition-colors"
					>
						Forgot Your Password?
					</button>
					<button
						on:click={() => (signup = !signup)}
						type="button"
						class="hover:text-cyan-700 transition-colors"
					>
						{#if signup}
							Have an Account?
						{:else}
							Need an Account?
						{/if}
					</button>
				</div>

				{#if signup}
					<Button on:click={() => (signup = true)} {disabled} type="submit">Sign Up</Button>
				{:else}
					<Button on:click={() => (signup = false)} {disabled} type="submit">Sign In</Button>
				{/if}
			</form>
		</div>
	</div>
	<div
		class="lg:flex lg:w-6/12 bg-lime-100 md:flex items-center justify-center hidden min-h-screen overflow-hidden"
	>
		<Logo />
	</div>
</div>
