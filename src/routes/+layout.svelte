<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	import Icon from '@iconify/svelte';
	import InstallButton from '$lib/components/InstallButton.svelte';
	import { page } from '$app/stores';

    let isBrowserTab = $state(true);

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { StatusBar, Style } from '@capacitor/status-bar';
	import { Capacitor } from '@capacitor/core';

	onMount(async () => {

        // This media query checks if the display mode is 'standalone',
        // which is the mode for an installed PWA.
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        // If it's running as a standalone PWA, update our variable.
        if (isStandalone) {
            isBrowserTab = false;
        }


		if (browser && Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
			await StatusBar.setOverlaysWebView({ overlay: false });
			// Optional: Customize to match your theme
			await StatusBar.setBackgroundColor({ color: '#030712' }); // Replace with your color
			await StatusBar.setStyle({ style: Style.Dark }); // Or Style.Dark
		}
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>CloudCam</title>
	<meta name="description" content="CloudCam is a camera app that saves photos and videos directly to the cloud, so you never run out of space and can access your memories anywhere." />
	<link rel="manifest" href="/manifest.webmanifest" />

	<meta property="og:title" content="CloudCam" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://cloudcambywurks.vercel.app/ogimage.png" />
	<meta property="og:url" content="https://cloudcambywurks.vercel.app/" />
	<meta
		property="og:description"
		content="CloudCam is a camera app that saves photos and videos directly to the cloud, so you never run out of space and can access your memories anywhere."
	/>
</svelte:head>

<div class="flex min-h-screen flex-col bg-gray-950 p-4 py-6 pt-8 text-center">
	<nav class="mx-4 mt-2 flex items-center justify-between">
		<!-- {#if $page.url.pathname != '/'}


			<a href="/" class="flex size-10 items-center justify-center rounded-full bg-gray-800">
				<Icon icon="ph:arrow-u-up-left-thin" class="size-6 text-white" />
			</a>
		{/if} -->

		<h1 class="text-4xl font-light tracking-tight text-gray-400">
			Hi, <span class="text-white">User</span>!
		</h1>

		<div class="flex space-x-4">
			<a href="/settings" class="flex size-10 items-center justify-center rounded-full bg-gray-800">
				<Icon icon="ph:gear-thin" class="size-6 text-white" />
			</a>
			<a href="/" class="flex size-10 items-center justify-center rounded-full bg-gray-800">
				<Icon icon="ph:house-thin" class="size-6 text-white" />
			</a>
		</div>
	</nav>

	{@render children?.()}

	<footer class="mt-auto pt-4">

		{#if isBrowserTab}
			<div class="bg-slate-900 rounded-xl p-4 md:p-6 mx-auto text-white tracking-tight w-2/3 md:w-1/3 lg:w-1/4 mb-6 flex flex-col items-center justify-center">
				<p class="text-sm md:text-base">This is a PWA (Progressive Web App) that can be installed on your device.</p>
				<a href="/info" class="mt-2 text-sm md:text-base text-gray-400">Click here to know more!</a>
				<InstallButton />
			</div>
		{/if}

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
	</footer>
</div>
