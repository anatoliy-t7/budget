<script>
	export let type = '';

	let classes = '';

	$: switch (type) {
		case 'expenses':
			classes = 'bg-red-200 text-red-900';
			break;
		case 'income':
			classes = 'bg-green-200 text-green-900';
			break;
		default:
			break;
	}
</script>

<div class="inline-block rounded-full px-3 py-1 text-xs font-medium capitalize {classes}">
	{type}
</div>
