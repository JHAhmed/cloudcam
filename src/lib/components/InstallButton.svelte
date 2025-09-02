<script>
    import { onMount } from 'svelte';

    let deferredPrompt;
    let showInstallButton = false;

    onMount(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the browser's default install prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            deferredPrompt = e;
            // Update UI to notify the user they can install the PWA
            showInstallButton = true;
        });

        window.addEventListener('appinstalled', () => {
            // Hide the install button if the app is successfully installed
            showInstallButton = false;
        });
    });

    async function handleInstallClick() {
        if (!deferredPrompt) {
            return;
        }
        // Show the browser's installation prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, throw it away
        deferredPrompt = null;
    }
</script>

{#if showInstallButton}
    <button class="bg-blue-500 px-6 py-3 text-white font-medium tracking-tight shadow-md/10 cursor-pointer rounded-xl text-sm md:text-lg" on:click={handleInstallClick}>
        Install CloudCam
    </button>
{/if}
