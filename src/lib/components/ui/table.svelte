<script lang="ts">
	export let head: string[] = [];
</script>

<div class="w-full overflow-hidden">
	<table>
		<thead>
			<tr class="border-white/5 border-b">
				{#each head as label}
					<th scope="col">
						{label}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			<slot />
		</tbody>
	</table>
</div>
