<script>
    import '../app.css';
    import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';
    import { page } from '$app/stores';
    import { blur } from 'svelte/transition';
    import { browser } from '$app/environment';
    import { Capacitor } from '@capacitor/core';
    import { StatusBar, Style } from '@capacitor/status-bar';
    
    import { animateIn } from '$lib';
    import favicon from '$lib/assets/favicon.svg';
    import { userState } from '$lib/state.svelte.js';
    import AuthLock from '$components/AuthLock.svelte';
    import InstallButton from '$lib/components/InstallButton.svelte';
	import { preloadData } from '$app/navigation';
    
    let { children, data } = $props();
    let isBrowserTab = $state(true);

    // --- ✅ FIX: Use $effect for reactive data syncing ---
    // This will now run automatically whenever the `data` prop changes (e.g., on login/logout).
    $effect(() => {
        userState.userId = data.user?.id ?? null;
        userState.username = data.user?.given_name ?? null;
        if (data.settings) {
            userState.theme = data.settings.theme;
            userState.imagePersistence = data.settings.imagePersistence;
            userState.instantUpload = data.settings.instantUpload;
        }
    });

    // --- ✅ IMPROVEMENT: Keep onMount ONLY for one-time setup logic ---
    onMount(async () => {
        // This logic only needs to run once, so it's perfect for onMount.
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) {
            isBrowserTab = false;
        }

        if (browser && Capacitor.isNativePlatform()) {
            await StatusBar.setOverlaysWebView({ overlay: false });
            await StatusBar.setBackgroundColor({ color: '#030712' });
            await StatusBar.setStyle({ style: Style.Dark });
        }

		preloadData('/gallery');
    });

    let navLinks = [
        { title: 'Home', icon: 'ph:house-thin', url: '/' },
        { title: 'Settings', icon: 'ph:gear-thin', url: '/settings' },
        { title: 'Profile', icon: 'ph:user-circle-thin', url: '/profile' }
    ];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>CloudCam</title>
	<meta
		name="description"
		content="CloudCam is a camera app that saves photos and videos directly to the cloud, so you never run out of space and can access your memories anywhere."
	/>
	<link rel="manifest" href="/manifest.webmanifest" />

	<meta property="og:title" content="CloudCam" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://cloudcam.wurks.studio/ogimage.png" />
	<meta property="og:url" content="https://cloudcam.wurks.studio/" />
	<meta
		property="og:description"
		content="CloudCam is a camera app that saves photos and videos directly to the cloud, so you never run out of space and can access your memories anywhere."
	/>
</svelte:head>

<div class:dark={userState.theme === 'dark'} class="bg-gray-50 dark:bg-gray-950">
	<div
		class="mx-auto flex min-h-screen flex-col bg-gray-50 p-4 py-6 pt-4 text-center md:max-w-5xl dark:bg-gray-950"
	>
		<nav class="mx-4 flex items-center justify-between">
			<h1 class="text-left text-4xl font-light tracking-tight text-gray-400">
				<span class="text-xl">Hi,</span> <br />
				<span class="text-black dark:text-white"
					>{data.user?.given_name ?? 'User'}</span
				>!
			</h1>

			<div class="flex space-x-2">
				{#each navLinks as link, i}
					<a
						href={link.url}
						use:animateIn={{ delay: i * 0.2, blur: 4 }}
						class="flex size-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
					>
						<Icon icon={link.icon} class="size-6 text-black dark:text-white" />
					</a>
				{/each}
			</div>
		</nav>

		{#key data.url}
			<!-- <div in:blur={{ duration: 200, delay: 200 }} out:blur={{ duration: 200 }}> -->
				<AuthLock isAuthenticated={data.isAuthenticated}>
					{@render children?.()}
				</AuthLock>
			<!-- </div> -->
		{/key}

		<footer class="mt-auto pt-4">
			{#if isBrowserTab}
				<div
					class="mx-auto mb-6 flex w-2/3 flex-col items-center justify-center rounded-xl bg-slate-100 p-4 tracking-tight text-black md:p-6 dark:bg-slate-900 dark:text-white"
				>
					<p class="text-sm md:text-base">
						This is a PWA (Progressive Web App) that can be installed on your device.
					</p>
					<a href="/info" class="mt-2 text-sm text-gray-600 md:text-base dark:text-gray-400"
						>Click here to know more!</a
					>
					<InstallButton />
				</div>
			{/if}

			<p class="text-sm font-normal text-gray-500">
				Made with ♥️ by
				<a
					use:animateIn={{ delay: 0.4, blur: 4 }}
					href="https://jamalhaneef.vercel.app/"
					class=""
					target="_blank"
					rel="noopener"
					><span
						class="mx-0.5 font-medium text-gray-700 decoration-gray-300 decoration-1 underline-offset-2 hover:underline dark:text-gray-300"
						>Jamal Haneef</span
					></a
				>
				<a
					use:animateIn={{ delay: 0.8, blur: 4 }}
					href="https://wurks.studio/"
					class=""
					target="_blank"
					rel="noopener"
					>& <span
						class="ml-0.5 font-medium text-black decoration-white decoration-1 underline-offset-2 hover:underline dark:text-white"
						>Wurks</span
					>.</a
				>
			</p>
		</footer>
	</div>
</div>
