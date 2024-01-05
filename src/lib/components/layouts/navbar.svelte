<script>
	import { pb } from '$lib/stores/pocketbase';
	import LogOut from '$lib/components/layouts/log-out.svelte';
	import Logo from '$lib/components/ui/logo.svelte';

	import MonthRange from '$lib/components/ui/month-range.svelte';

	import ChevronDown from '~icons/solar/alt-arrow-down-linear';
	import Dropdown from '../ui/dropdown.svelte';
</script>

<div
	class="fixed inset-x-0 top-0 z-20 flex w-full justify-between gap-4 border-b border-gray-200 bg-white px-4 py-4 md:px-8">
	<div class="flex w-full items-center gap-7">
		<div class="w-[332px]">
			<a href="/" class="block p-1">
				<Logo />
			</a>
		</div>

		<MonthRange />
	</div>

	<div class="flex justify-end">
		<Dropdown>
			<div slot="trigger">
				<div
					class="flex items-center gap-1 rounded-full bg-gray-100 py-2 pl-4 pr-3 hover:bg-gray-200">
					{pb.authStore.model?.name ? pb.authStore.model?.name : pb.authStore.model?.email}

					<ChevronDown />
				</div>
			</div>
			<div
				slot="content"
				class="right-0 w-40 space-y-1 rounded-xl bg-white p-2 text-sm shadow-small">
				<LogOut />
			</div>
		</Dropdown>
	</div>
</div>
