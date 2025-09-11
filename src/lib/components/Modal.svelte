<script>
	import { FileTransfer } from '@capacitor/file-transfer';
	import { Filesystem, Directory } from '@capacitor/filesystem';
	import { Capacitor } from '@capacitor/core';
	import { onMount, onDestroy } from 'svelte';
	import { App } from '@capacitor/app';

	import { Toaster, toast } from 'svelte-sonner';

	let { image, handleBackdropClick = () => {}, handleDelete = () => {} } = $props();

	const blobToBase64 = (blob) => {
		return new Promise((resolve, _) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.readAsDataURL(blob);
		});
	};

	async function deletePhoto() {
		const imageKey = image.key;

		const response = await fetch('/api/delete-image', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ fileKey: imageKey })
		});

		if (response.ok) {
			handleDelete(imageKey);
		} else {
			console.error('Error deleting file');
			toast.error('Failed to delete image from storage');
		}
	}

	async function downloadPhoto() {
		const response = await fetch('/api/get-image-url', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ fileKey: image.key })
		});

		if (!response.ok) {
			toast.error('Failed to get download link');
			return;
		}

		const { signedUrl } = await response.json();

		if (!Capacitor.isNativePlatform()) {
			const link = document.createElement('a');
			link.href = signedUrl;
			link.download = image.name;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success('Image downloaded!');
			return;
		}

		// Native Platform Logic (Android/iOS)
		try {
			// Request permissions first (important for Android)
			const permissions = await Filesystem.checkPermissions();
			if (permissions.publicStorage !== 'granted') {
				const permissionStatus = await Filesystem.requestPermissions();
				if (permissionStatus.publicStorage !== 'granted') {
					await Toast.show({ text: 'Storage permission is required to download images.' });
					return;
				}
			}

			await Filesystem.downloadFile({
				path: image.name, // The filename to save as
				url: signedUrl, // The presigned URL from your API
				directory: Directory.Documents // Save to the user's Documents folder
			});

			await Toast.show({
				text: `Image saved to Documents!`,
				duration: 'long'
			});
		} catch (error) {
			console.error('Native download error:', error);
			await Toast.show({
				text: 'Could not save the image.'
			});
		}
	}

	let listener = $state();

	onMount(async () => {
		// Add the listener when the component is mounted
		listener = await App.addListener('backButton', (event) => {
			// The listener automatically prevents the default back navigation.
			// Just call your function to close the modal.
			console.log('Hardware back button pressed!');
			handleBackdropClick();
		});
	});

	onDestroy(async () => {
		// IMPORTANT: Clean up the listener when the component is destroyed
		if (listener) {
			await listener.remove();
		}
	});
</script>

<Toaster richColors position="bottom-right" />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	onclick={handleBackdropClick}
	class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm"
>
	<img
		src={image.url}
		alt="Selected item from gallery"
		class="my-2 h-fit max-h-[90vh] w-3/4 rounded-lg md:h-[30rem] md:w-fit"
		loading="lazy"
	/>
	<div class="flex w-3/4 items-center justify-center space-x-2 md:w-1/2">
		<button
			class="w-full cursor-pointer rounded-lg bg-gradient-to-br from-white to-gray-200 px-4 py-4 text-xs leading-4 font-light tracking-tight md:px-12 md:text-sm"
			onclick={downloadPhoto}
		>
			Download
		</button>
		<button
			class="w-full cursor-pointer rounded-lg bg-red-500/70 px-4 py-4 text-xs leading-4 font-light tracking-tight text-white md:px-12 md:text-sm"
			onclick={deletePhoto}
		>
			Delete
		</button>
	</div>

	<!-- <div class="mx-auto bg-amber-50 my-auto flex h-fit w-3/4 flex-col items-center justify-center gap-2">
    <img
        src={image.url}
        alt="Selected item from gallery"
        class="h-fit md:h-[30rem] w-fit rounded-lg mt-auto"
        loading="lazy"
    />
		<div class="flex w-full md:w-1/2 items-center justify-center space-x-2">
			<button
				class="w-full cursor-pointer rounded-xl bg-gradient-to-br from-white to-gray-200 px-12 py-4 text-sm leading-4 font-light tracking-tight"
				onclick={downloadPhoto}
			>
				Download
			</button>
			<button
				class="w-full cursor-pointer rounded-xl bg-red-500/70 px-12 py-4 text-sm leading-4 font-light tracking-tight text-white"
				onclick={deletePhoto}
			>
				Delete
			</button>
		</div>
	</div> -->
</div>
