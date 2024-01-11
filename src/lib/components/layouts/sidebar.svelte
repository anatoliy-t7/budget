<script lang="ts">
	import Graph from '~icons/solar/graph-broken';
	import GraphBold from '~icons/solar/graph-bold';
	import IconReports from '~icons/solar/chat-square-2-broken';
	import IconReportsBold from '~icons/solar/chat-square-2-bold';
	import IconTransfer from '~icons/solar/square-transfer-vertical-broken';
	import IconTransferBold from '~icons/solar/square-transfer-vertical-bold';
	import Settings from '~icons/solar/settings-broken';
	import SettingsBold from '~icons/solar/settings-bold';

	import IconAdd from '~icons/solar/add-square-linear';

	import IconPlus from '~icons/tabler/plus';
	import { page } from '$app/stores';
	import { openEdit } from '$lib/stores/transactions';
	import { isMobile } from '$lib/utils/utils';

	$: activeUrl = $page.url;

	export let links = [
		{
			name: 'Overview',
			url: '/',
			icon: Graph,
			iconActive: GraphBold,
		},
		{
			name: 'Transactions',
			url: '/transactions',
			icon: IconTransfer,
			iconActive: IconTransferBold,
		},
		{
			name: 'Reports',
			url: '/reports',
			icon: IconReports,
			iconActive: IconReportsBold,
		},
		{
			name: 'Settings',
			url: '/settings',
			icon: Settings,
			iconActive: SettingsBold,
		},
	];
</script>

{#if isMobile()}
	<div
		class="fixed bottom-0 left-0 z-30 flex w-full justify-between border-t border-gray-200 bg-white px-8 py-3 text-gray-900">
		<a href={links[0].url} class="click rounded-xl p-2">
			<svelte:component
				this={activeUrl.pathname === links[0].url ? links[0].iconActive : links[0].icon}
				class="h-6 w-6" />
		</a>

		<a href={links[1].url} class="click rounded-xl p-2">
			<svelte:component
				this={activeUrl.pathname === links[1].url ? links[1].iconActive : links[1].icon}
				class="h-6 w-6" />
		</a>

		<div class="">
			<button on:click={() => openEdit()} class="click">
				<IconAdd class="h-10 w-10" />
			</button>
		</div>

		<a href={links[2].url} class="click rounded-xl p-2">
			<svelte:component
				this={activeUrl.pathname === links[2].url ? links[2].iconActive : links[2].icon}
				class="h-6 w-6" />
		</a>

		<a href={links[3].url} class="click rounded-xl p-2">
			<svelte:component
				this={activeUrl.pathname === links[3].url ? links[3].iconActive : links[3].icon}
				class="h-6 w-6" />
		</a>
	</div>
{:else}
	<div class="fixed left-0 top-16 z-40 flex h-full min-h-screen w-72 flex-col justify-between p-8">
		<div class="space-y-1 pt-2 text-gray-700">
			<div class="pb-7">
				<button
					on:click={() => openEdit()}
					class="click inline-flex w-full items-center gap-3 rounded-xl border border-green-300 bg-green-300 px-4 py-3 text-left text-base font-medium text-green-950 hover:border-green-400 hover:bg-green-400">
					<IconPlus class="h-6 w-6" />
					Add transaction
				</button>
			</div>

			{#each links as link, a}
				<a
					href={link.url}
					class="{activeUrl.pathname === link.url
						? 'border-gray-500 font-medium '
						: 'border-transparent hover:border-gray-400'} click inline-flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-base">
					{#if link.icon}
						<svelte:component this={link.icon} class="h-6 w-6" />
					{/if}
					{link.name}
				</a>
			{/each}
		</div>
	</div>
{/if}
