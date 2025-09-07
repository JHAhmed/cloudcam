<script>
	import SettingToggle from "$components/SettingToggle.svelte";
</script>

<div class="flex flex-col mx-4 mt-8 items-start justify-start font-light text-white text-left">
	<h1 class="text-3xl font-normal">Settings</h1>
	<!-- <p class="mt-2 text-lg text-gray-300">Manage your preferences and settings here.</p> -->
	<!-- <p class="mt-1 text-sm text-gray-400">These are dummy settings as placeholders for now.</p> -->
</div>

<div class="my-8 px-4">

	<div class="flex items-center w-full text-white">
		<p class="w-full text-left
		">Image Persistence</p>
		<div class="w-full">
			<SettingToggle value="on" options={['on', 'off']} />
		</div>
	</div>

</div>



