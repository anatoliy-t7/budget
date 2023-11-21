<script lang="ts">
	import { page } from '$app/stores';
	const img = '/img/error.webp';
</script>

<main class="isolate relative h-full min-h-screen">
	<img
		src={img}
		alt="error"
		class="-z-10 absolute inset-0 object-cover object-bottom w-full h-full"
	/>
	<div class="max-w-7xl sm:py-40 lg:px-8 px-6 py-32 mx-auto text-center">
		<p class="text-3xl font-semibold leading-8 text-white">{$page.status}</p>
		<h1 class="sm:text-5xl mt-4 text-3xl font-bold tracking-tight text-white">Page not found</h1>
		<p class="sm:mt-6 mt-4 text-lg text-white">
			Sorry, we couldn’t find the page you’re looking for.
		</p>
		<div class="flex justify-center mt-10">
			<a href="/" class="hover:underline unstyled text-xl leading-7 text-white"
				><span aria-hidden="true" class="pr-1">&larr;</span>Go back
			</a>
		</div>
	</div>
</main>
