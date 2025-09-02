<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	import Icon from '@iconify/svelte';

	import { page } from '$app/stores';


	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { StatusBar, Style } from '@capacitor/status-bar';
	import { Capacitor } from '@capacitor/core';

	onMount(async () => {
		if (browser && Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
			await StatusBar.setOverlaysWebView({ overlay: false });
			// Optional: Customize to match your theme
			await StatusBar.setBackgroundColor({ color: '#000000' }); // Replace with your color
			await StatusBar.setStyle({ style: Style.Dark }); // Or Style.Dark
		}
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col bg-gray-950 p-4 py-6 pt-8 text-center">
	<nav class="mx-4 mt-6 flex items-center justify-between">

		<!-- {#if $page.url.pathname != '/'}


			<a href="/" class="flex size-10 items-center justify-center rounded-full bg-gray-800">
				<Icon icon="ph:arrow-u-up-left-thin" class="size-6 text-white" />
			</a>
		{/if} -->

		<h1 class="text-4xl font-light tracking-tight text-gray-400">
			Hi, <span class="text-white">User</span>!
		</h1>

		<div class="flex space-x-4">
			<div class="flex size-10 items-center justify-center rounded-full bg-gray-800">
				<Icon icon="ph:gear-thin" class="size-6 text-white" />
			</div>
			<a href="/" class="flex size-10 items-center justify-center rounded-full bg-gray-800">
				<Icon icon="ph:house-thin" class="size-6 text-white" />
			</a>
		</div>
	</nav>

	{@render children?.()}

	<div class="mt-auto pt-4">
		<p class="text-sm font-normal text-gray-500">
			Made with ♥️ by
			<a href="https://jamal-haneef.vercel.app/" class=""
				><span
					class="mx-0.5 font-medium text-gray-300 decoration-gray-300 decoration-1 underline-offset-2 hover:underline"
					>Jamal Haneef</span
				></a
			>
			<a href="https://wurks.studio/" class=""
				>& <span
					class="ml-0.5 font-medium text-purple-600 decoration-purple-600 decoration-1 underline-offset-2 hover:underline"
					>Wurks</span
				>.</a
			>
		</p>
	</div>
</div>
