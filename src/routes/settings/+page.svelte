<script>
	import SettingToggle from "$components/SettingToggle.svelte";
	import { userState } from "$lib/state.svelte";
	import { toast, Toaster } from "svelte-sonner";
	import { onMount } from "svelte";

	// let theme = $state("dark");
	// let imagePersistence = $state("on");

	// let { theme, imagePersistence } = userState;

	let theme = $state(userState.theme);
	let imagePersistence = $state(userState.imagePersistence);

	let toggled = $state(false);

	const onToggle = () => {
		toggled = true;
	};

	async function handleSave() {

		const response = await fetch("/api/settings", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				theme,
				imagePersistence,
			})
		});

		userState.theme = theme;	
		userState.imagePersistence = imagePersistence;

		toggled = false;

		if (response.ok) {
			toast.success("Settings updated");
		} else {
			toast.error("Error updating settings");
		}
	}
</script>

<Toaster position="bottom" richColors />

<div class="flex  mx-4 mt-8 items-start justify-between font-light text-white text-left">
	<h1 class="text-3xl font-normal">Settings</h1>
	<button onclick={handleSave} disabled={!toggled} class="rounded-lg bg-white/10 px-6 py-2 text-sm font-light disabled:opacity-70 disabled:pointer-events-none text-white hover:bg-white/20">Save</button>

</div>

<div class="my-8 px-4">

	<div class="w-full flex flex-col space-y-4 text-white">
		<div class="flex items-center w-full">
			<p class="w-full text-left">Theme</p>
			<div class="w-full">
				<SettingToggle {onToggle} bind:value={theme} options={['dark', 'light']} />
			</div>
		</div>
		<div class="flex items-center w-full">
			<p class="w-full text-left">Image Persistence</p>
			<div class="w-full">
				<SettingToggle {onToggle} bind:value={imagePersistence} options={['on', 'off']} />
			</div>
		</div>
	</div>

</div>



