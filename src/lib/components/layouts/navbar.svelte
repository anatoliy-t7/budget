<script>
	import { pb } from '$lib/stores/pocketbase';
	import LogOut from '$lib/components/layouts/log-out.svelte';
	import Logo from '$lib/components/ui/logo.svelte';

	import MonthRange from '$lib/components/ui/month-range.svelte';

	import ChevronDown from '~icons/solar/alt-arrow-down-linear';
	import Dropdown from '../ui/dropdown.svelte';
	import Profile from './profile.svelte';
</script>

<div
	class="md:px-8 fixed inset-x-0 top-0 z-20 flex justify-between w-full gap-4 px-4 py-4 bg-white border-b border-gray-200">
	<div class="gap-7 flex items-center w-full">
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
					class="hover:bg-gray-200 flex items-center gap-1 py-2 pl-4 pr-3 bg-gray-100 rounded-full">
					{pb.authStore.model?.name ? pb.authStore.model?.name : pb.authStore.model?.email}

					<ChevronDown />
				</div>
			</div>
			<div
				slot="content"
				class="rounded-xl shadow-small right-0 w-40 p-2 space-y-1 text-sm bg-white">
				<Profile />
				<LogOut />
			</div>
		</Dropdown>
	</div>
</div>
