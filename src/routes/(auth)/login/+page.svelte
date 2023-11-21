<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	export let form;

	let message = 'You must be logged in to access this page';
	$: hasRedirect = $page.url.searchParams.get('redirectTo') ? true : false;
</script>

<div class="flex justify-center flex-col space-y-6 lg:w-80">
	{#if hasRedirect}
		<p class="alert">{message}</p>
	{/if}

	<div class="text-center">
		<h2 class="text-2xl font-bold tracking-tight text-primary-900 unstyled">
			Sign in to your account
		</h2>
		<p class="mt-2 text-sm text-primary-600">
			or
			<a href="/register" class="font-medium text-indigo-600 hover:text-indigo-500">register</a>
		</p>
	</div>

	<div class="mt-6">
		<form action="#" method="POST" class="space-y-4" use:enhance>
			<label class="label">
				<span>Email address</span>
				<input
					class="input w-full"
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					required
				/>
			</label>

			<label class="label">
				<span>Password</span>
				<input
					class="input w-full"
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
				/>
			</label>

			<button type="submit" class="btn variant-filled-primary w-full"> Sign in </button>
		</form>

		{#if form?.error}
			<p class="pt-2 text-red-600">{form?.error}</p>
		{/if}

		<div class="flex items-center justify-end pt-2">
			<a href="/password-reset" class="text-sm hover:underline unstyled">Forgot your password?</a>
		</div>
	</div>
</div>
