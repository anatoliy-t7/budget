<script>
	import { page } from '$app/stores';
	const img = '/img/error.webp';
</script>

<main class="relative isolate h-full min-h-screen">
	<img
		src={img}
		alt="error"
		class="absolute inset-0 -z-10 h-full w-full object-cover object-bottom" />
	<div class="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
		<p class="text-3xl font-semibold leading-8 text-white">{$page.status}</p>
		<h1 class="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">Page not found</h1>
		<p class="mt-4 text-lg text-white sm:mt-6">
			Sorry, we couldn’t find the page you’re looking for.
		</p>
		<div class="mt-10 flex justify-center">
			<a href="/" class="unstyled text-xl leading-7 text-white hover:underline"
				><span aria-hidden="true" class="pr-1">&larr;</span>Go back
			</a>
		</div>
	</div>
</main>
