<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { form, errors, constraints, enhance, delayed, message } = superForm(data.form);
</script>

<div class="lg:w-80 flex flex-col justify-center space-y-6">
	<div class="text-center">
		<h2 class=" unstyled text-2xl font-bold tracking-tight">Login to your account</h2>
		<p class=" mt-2 text-sm">
			or
			<a href="/register" class=" font-medium">register</a>
		</p>
	</div>

	<div class="mt-6">
		<form action="#" method="POST" use:enhance>
			<div class="grid gap-3">
				<div class="grid gap-1">
					<Label for="email">Email address</Label>
					<Input
						class="input w-full"
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						aria-invalid={$errors.email ? 'true' : undefined}
						bind:value={$form.email}
						{...$constraints.email}
					/>
					{#if $errors.email}
						<span class="invalid">{$errors.email}</span>
					{/if}
				</div>

				<div class="grid gap-1">
					<Label for="password">Password</Label>
					<Input
						class="input w-full"
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						aria-invalid={$errors.password ? 'true' : undefined}
						bind:value={$form.password}
						{...$constraints.password}
					/>
					{#if $errors.password}
						<span class="invalid">{$errors.password}</span>
					{/if}
				</div>

				<Button type="submit">Sign in</Button>

				{#if $message}
					<h3 class:invalid={$page.status >= 400}>{$message}</h3>
				{/if}
			</div>
		</form>

		<div class="flex items-center justify-end pt-2">
			<a href="/password-reset" class="hover:underline unstyled text-sm">Forgot your password?</a>
		</div>
	</div>
</div>
