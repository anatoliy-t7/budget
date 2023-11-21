<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { superForm } from 'sveltekit-superforms/client';
	import { userSchema } from '$lib/zod';
	import IconLoader2 from '~icons/tabler/loader-2';
	export let data;

	const signUpSchema = userSchema.pick({
		email: true,
		password: true,
		passwordConfirm: true,
	});

	const { form, errors, enhance, delayed, constraints } = superForm(data.form, {
		taintedMessage: null,
		validators: signUpSchema,
		delayMs: 0,
		dataType: 'json',
	});
</script>

<div class="lg:w-80 flex flex-col justify-center space-y-6">
	<div class="text-center">
		<h2 class="text-primary-900 unstyled text-2xl font-bold tracking-tight">Register</h2>
		<p class="text-primary-600 mt-2 text-sm">
			Already have an account?
			<a href="/login" class="hover:text-indigo-500 font-medium text-indigo-600">Login</a>
		</p>
	</div>

	<div class="mt-6">
		<form method="POST" class="space-y-4" use:enhance>
			<label class="label">
				<span>Email address</span>
				<input
					bind:value={$form.email}
					aria-invalid={$errors.email ? 'true' : undefined}
					class:input-error={$errors.email}
					{...$constraints.email}
					class="input"
					name="email"
					type="email"
					autocomplete="email"
					required
				/>
				{#if $errors.email}
					{$errors.email}
				{/if}
			</label>

			<label class="label">
				<span>Password</span>
				<input
					bind:value={$form.password}
					aria-invalid={$errors.password ? 'true' : undefined}
					class:input-error={$errors.password}
					{...$constraints.password}
					class="input w-full"
					name="password"
					type="password"
					autocomplete="current-password"
					required
				/>
				{#if $errors.password}
					{$errors.password}
				{/if}
			</label>

			<Button type="submit" disabled={$delayed}>
				{#if $delayed}
					<IconLoader2 />
				{/if}
				Sign up
			</Button>
		</form>
	</div>
</div>
