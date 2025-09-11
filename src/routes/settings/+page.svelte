<script>
	import SettingToggle from "$components/SettingToggle.svelte";
	import { userState } from "$lib/state.svelte";
	import { toast, Toaster } from "svelte-sonner";
	import { onMount } from "svelte";

	let theme = $state(userState.theme);
	let imagePersistence = $state(userState.imagePersistence);
	let instantUpload = $state(userState.instantUpload);

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
				instantUpload,
				imagePersistence,
			})
		});

		userState.theme = theme;	
		userState.instantUpload = instantUpload;
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

<div class="flex mx-4 mt-8 items-start justify-between font-light text-black dark:text-white text-left">
	<h1 class="text-3xl font-normal">Settings</h1>
	<button onclick={handleSave} disabled={!toggled} class="rounded-lg bg-black/10 dark:bg-white/10 px-6 py-2 text-sm font-light disabled:opacity-50 disabled:pointer-events-none text-black dark:text-white hover:bg-black/20 dark:hover:bg-white/20">Save</button>

</div>

<div class="my-8 px-4">

	<div class="w-full flex flex-col space-y-4 text-black dark:text-white">
		<div class="flex items-center w-full">
			<p class="w-full text-left">Theme</p>
			<div class="w-full">
				<SettingToggle {onToggle} bind:value={theme} options={['dark', 'light']} />
			</div>
		</div>
		<div class="flex items-center w-full">
			<p class="w-full text-left">Instant Upload</p>
			<div class="w-full">
				<SettingToggle {onToggle} bind:value={instantUpload} options={['on', 'off']} />
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



