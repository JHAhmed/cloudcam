<script>
	import { invalidateAll } from '$app/navigation';
	import Input from '$components/Input.svelte';
	import { userState } from '$lib/state.svelte.js';
	import { onMount } from 'svelte';
	import { toast, Toaster } from 'svelte-sonner';

	let username = $state("");
	let toggled = $state(false);

	let isLoading = $state(false);

	onMount(async () => {
		userState.username ? username = userState.username : username = "";
	});

	async function handleSave() {

		isLoading = true;
		const response = await fetch("/api/update-profile", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				username
			})
		});

		toggled = false;
		isLoading = false;

		if (response.ok) {
			await invalidateAll();
			userState.username = username;
			toast.success("Username updated");
		} else {
			toast.error("Error updating username");
		}
	}

</script>

<Toaster position="bottom" richColors />

{#if isLoading}
	<Loader message="Saving your profile..." />
{/if}

<div class="flex mx-4 mt-8 items-start justify-between font-light text-black dark:text-white text-left">
	<h1 class="text-3xl font-normal">Profile</h1>
	<button onclick={handleSave} disabled={!toggled} class="rounded-lg bg-black/10 dark:bg-white/10 px-6 py-2 text-sm font-light disabled:opacity-50 disabled:pointer-events-none text-black dark:text-white hover:bg-black/20 dark:hover:bg-white/20">Save</button>

</div>

<div class="my-8 px-4">
	<div class="flex w-full items-center text-white mb-8">
		<Input oninput={() => toggled = true} label="Username" bind:value={username} />
	</div>

	<a href="/api/auth/logout" class="mt-12 rounded-2xl bg-red-500/20 dark:bg-red-600/30 px-6 py-3 text-sm font-light text-black dark:text-white hover:bg-red-500/30 dark:hover:bg-red-700/50">Logout</a>
</div>
