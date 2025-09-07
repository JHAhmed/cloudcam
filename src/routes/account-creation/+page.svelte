<script>
	import confetti from 'canvas-confetti';
	import { addPreference } from '$lib/preferences.js';
	import { onMount } from 'svelte';

	let hasSetup = $state(false);

    let { data } = $props();
    let userId = "kp_fdbe5ffa05904cf4bd049f6102c40919";

    onMount(async () => {
        // addPreference(userId, false, true).then(() => {
        //     hasSetup = true;
        // }).catch((error) => {
        //     console.error("Error setting up account:", error);
        // });

        // const response = await fetch('/api/create-user', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         userId: userId,
        //         email: "jamal@example.com",
        //         name: "Jamal"
        //     })
        // });

        if (response.ok) {
            hasSetup = true;
            const output = await response.json();
            console.log("User created successfully:", output);
        } else {
            console.error("Error setting up account:", response.statusText);
        }
    });

    $effect(() => {
        if (hasSetup) {
            triggerConfetti();
        }
    });

	function triggerConfetti() {
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { y: 0.6 }
		});
	}
</script>

<div class="my-8 flex flex-col items-center justify-center px-4">
	{#if !hasSetup}
		<h1 class="text-2xl font-light tracking-tight text-white">Setting up account...</h1>
	{:else}
		<h1 class="text-2xl font-light tracking-tight text-white">Account set up successfully!</h1>
		<a href="/" class="mt-4 rounded-2xl bg-white/10 px-6 py-3 text-sm font-light text-white hover:bg-white/20">Start snapping!</a>

	{/if}
</div>
