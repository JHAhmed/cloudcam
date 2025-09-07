<script>
	import Input from '$components/Input.svelte';
	import { userState } from '$lib/state.svelte.js';
	import { onMount } from 'svelte';
</script>

<div class="mx-4 mt-8 flex flex-col items-start justify-start text-left font-light text-white">
	<h1 class="text-3xl font-normal">Profile</h1>
	<!-- <p class="mt-2 text-lg text-gray-300">Manage your preferences and settings here.</p>
	<p class="mt-1 text-sm text-gray-400">These are dummy settings as placeholders for now.</p> -->
</div>

<div class="my-8 px-4">
	<!-- <div class="flex w-full items-center text-white mb-8">
		<Input label="Username" bind:value={userState.username} />
	</div> -->

	<a href="/api/auth/logout" class="mt-8 rounded-2xl bg-white/10 px-6 py-3 text-sm font-light text-white hover:bg-white/20">Logout</a>
	<!-- <a href="/api/auth/logout" class="text-sm text-gray-400 hover:underline">Log out</a> -->
</div>
