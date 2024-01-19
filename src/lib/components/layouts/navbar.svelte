<script>
	import IconBilling from '~icons/solar/bill-broken';
	import IconChevronDown from '~icons/solar/alt-arrow-down-linear';
	import IconUser from '~icons/solar/user-circle-broken';
	import Dropdown from '../ui/dropdown.svelte';
	import LogOut from '$lib/components/layouts/log-out.svelte';
	import Logo from '$lib/components/ui/logo.svelte';
	import MonthRange from '$lib/components/ui/month-range.svelte';

	import { pb } from '$lib/stores/pocketbase';
	import { billingPortalUrl, editProfile } from '$lib/stores/main';
	import { trialGone, isMobile } from '$lib/utils/utils';
</script>

<div
	class="fixed inset-x-0 top-0 z-30 grid w-full grid-cols-12 justify-between gap-2 border-b border-gray-200 bg-white px-4 py-3 sm:gap-4 sm:px-8">
	<div class="col-span-3 flex items-center gap-4 sm:gap-7">
		<div class="sm:w-[280px]">
			<a href="/" class="block p-1">
				<Logo />
			</a>
		</div>
	</div>

	<div class="col-span-6 mx-auto">
		<MonthRange />
	</div>

	<div class="col-span-3 flex items-center justify-end gap-4">
		<!-- <div>trial gone: {trialGone()}</div> -->
		<div>
			<Dropdown>
				<div slot="trigger">
					<div
						class="{isMobile()
							? 'px-2'
							: 'pl-4 pr-3'} flex items-center gap-1 truncate rounded-full bg-gray-100 py-2 text-sm hover:bg-gray-200">
						{#if !isMobile()}
							{pb.authStore.model?.name ? pb.authStore.model?.name : pb.authStore.model?.email}
						{/if}

						<IconChevronDown />
					</div>
				</div>
				<div
					slot="content"
					class="right-0 w-40 space-y-1 rounded-xl bg-white p-2 text-sm shadow-small">
					<button
						on:click={() => ($editProfile = true)}
						type="button"
						class="click flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-gray-100">
						<IconUser class="h-7 w-7" />
						Profile
					</button>
					{#if $billingPortalUrl}
						<a
							href={$billingPortalUrl}
							class="click flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-gray-100">
							<IconBilling class="h-7 w-7" />
							Billings
						</a>
					{/if}

					<LogOut />
				</div>
			</Dropdown>
		</div>
	</div>
</div>
