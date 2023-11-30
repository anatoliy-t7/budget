<script lang="ts">
	export let data: any;
</script>

{#if data.totalItems > data.perPage}
	<div class="flex">
		<button type="button" on:click={() => ''} disabled={data.page <= 1}> prev </button>

		<div>page {data.page} of {data.totalPages}</div>

		<button type="button" on:click={() => ''} disabled={data.page >= data.totalPages}>next</button>
	</div>
{/if}
