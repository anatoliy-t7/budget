<script lang="ts">
	import { pb, providerLogin, loading } from '$lib/stores/pocketbase';
	import Button from '$lib/components/ui/button.svelte';
	import { alertOnFailure } from '$lib/utils/utils';
	import GoogleIcon from '$lib/components/ui/google-icon.svelte';
	import Logo from '$lib/components/ui/logo.svelte';

	export let authCollection = 'users';
	export let authType = 'signin';

	const coll = pb.collection(authCollection);

	let email: string;
	let password: string;
	$: disabled = !email?.length && !password?.length;

	async function submit() {
		alertOnFailure(async () => {
			if (authType === 'signup') {
				await coll.create({ email, password, passwordConfirm: password });
			}
			await coll.authWithPassword(email, password);
		});
	}

	async function reset() {
		alertOnFailure(async () => {
			await coll.requestPasswordReset(email);
		});
	}

	async function toggleAuth() {
		if (authType === 'signup') {
			authType = 'signin';
		} else {
			authType = 'signup';
		}
	}
</script>

<div class="flex max-h-screen min-h-screen w-full items-center justify-center bg-gray-100">
	<div>
		<div class="flex justify-center pb-6">
			<Logo />
		</div>

		<div class="flex w-80 min-w-[360px] flex-col justify-center space-y-8 rounded-lg bg-white p-6">
			<div class="text-center text-2xl font-medium">
				{#if authType === 'signup'}
					Sign up for an Account
				{/if}
				{#if authType === 'signin'}
					Sign in to Your Account
				{/if}
				{#if authType === 'reset'}
					Reset Your Password
					<p class="block pb-4 text-sm text-gray-500">
						Enter the email associated with your account and we’ll send you password reset
						instructions.
					</p>
				{/if}
			</div>
			{#if authType !== 'reset'}
				<form on:submit|preventDefault={submit} class="grid gap-5">
					{#await coll.listAuthMethods({ $autoCancel: false }) then methods}
						{#each methods.authProviders as p}
							<Button
								color={'outline'}
								type="button"
								on:click={() => providerLogin(p, coll)}
								disabled={$loading}
								loading={$loading}>
								{#if p.name === 'google'}
									<GoogleIcon />
								{/if}
								{#if authType === 'signup'}
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
							<div class="w-full border-t border-gray-300"></div>
						</div>
						<div class="relative flex justify-center text-sm">
							<span class="bg-white px-2 font-medium text-gray-400"> or </span>
						</div>
					</div>

					<label class="block space-y-1 text-sm font-medium">
						<span> Email Address</span>

						<input
							bind:value={email}
							autocapitalize="off"
							autocorrect="off"
							pattern="[^@]+@[^@]+.[a-zA-Z]"
							required
							type="email"
							disabled={$loading} />
					</label>

					<label class="block space-y-1 text-sm font-medium">
						<span>Password</span>
						<input bind:value={password} disabled={$loading} required type="password" />
					</label>
					<div class="flex items-center justify-between text-sm text-cyan-600">
						<button
							on:click={() => (authType = 'reset')}
							type="button"
							class="transition-colors hover:text-cyan-700">
							Forgot Your Password?
						</button>
						<button
							on:click={() => toggleAuth()}
							type="button"
							class="transition-colors hover:text-cyan-700">
							{#if authType === 'signup'}
								Have an Account?
							{:else}
								Need an Account?
							{/if}
						</button>
					</div>

					{#if authType === 'signup'}
						<Button on:click={() => (authType = 'signup')} disabled={disabled} type="submit"
							>Sign Up</Button>
					{:else}
						<Button on:click={() => (authType = 'signin')} disabled={disabled} type="submit"
							>Sign In</Button>
					{/if}
				</form>
			{:else}
				<form on:submit|preventDefault={reset} class="grid gap-5">
					<label class="block space-y-1 text-sm font-medium">
						<span>Email Address</span>

						<input
							bind:value={email}
							autocapitalize="off"
							autocorrect="off"
							pattern="[^@]+@[^@]+.[a-zA-Z]"
							required
							disabled={$loading}
							type="email" />
					</label>

					<Button disabled={disabled || $loading} type="submit">Send Reset Instructions</Button>

					<button
						on:click={() => (authType = 'signin')}
						type="button"
						class="transition-colors hover:text-cyan-700">
						Return to Sign In
					</button>
				</form>
			{/if}
		</div>
	</div>
</div>
