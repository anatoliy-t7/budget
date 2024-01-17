<script>
	export let tags = '';
</script>

{#if tags.length}
	<div class="flex flex-wrap items-center gap-1">
		{#each tags.split(',') as tag}
			<div class="rounded-full bg-amber-200 px-2.5 py-1 text-xs font-medium">
				{tag}
			</div>
		{/each}
	</div>
{/if}
