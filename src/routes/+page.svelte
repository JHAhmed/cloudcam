<script>
	import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
	import { Toaster, toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import { userState } from '$lib/state.svelte.js';

	let { data } = $props();

	let photoUrl = $state(null);
	let message = $state('');

	// let userId = data.user ? data.user.id : null;
	let userId = userState.userId;
	// console.log("Home:", $state.snapshot(userState));

	async function convertToBase64(photoUrl) {
		const response = await fetch(photoUrl);
		const blob = await response.blob();

		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onerror = reject;
			reader.onload = () => resolve(reader.result);
			// reader.result is "data:<mimetype>;base64,<data>"
			// split to get only the base64 string
			reader.readAsDataURL(blob);
		});
	}

	const takePhoto = async () => {
		try {
			const image = await Camera.getPhoto({
				quality: 99,
				// allowEditing: true,
				resultType: CameraResultType.Uri,
				source: CameraSource.Camera
			});

			photoUrl = image.webPath;
		} catch (e) {
			console.error('Error taking photo', e);
		}
	};

	const savePhoto = async () => {
		// 1. Check if a photo has been taken
		if (!photoUrl) {
			toast.error('Please take a photo first.');
			return;
		}

		toast.loading('Saving image...');

		try {
			// 2. Fetch the image data from the temporary URL
			const response = await fetch(photoUrl);
			const photoBlob = await response.blob();

			// 3. Create a unique file name for the image
			const fileName = `photo_${Date.now()}`;

			// 4. Get a pre-signed URL from your backend
			const presignedUrlResponse = await fetch('/api/get-upload-url', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					fileName: fileName,
					fileType: photoBlob.type,
					userId: userId // Pass the user ID to organize files per user
				})
			});

			if (!presignedUrlResponse.ok) {
				throw new Error('Failed to get an upload URL.');
			}

			const { url: presignedUrl } = await presignedUrlResponse.json();

			// 5. Upload the blob directly to Cloudflare R2 using the pre-signed URL
			const uploadResponse = await fetch(presignedUrl, {
				method: 'PUT',
				body: photoBlob,
				headers: {
					'Content-Type': photoBlob.type
				}
			});

			if (!uploadResponse.ok) {
				throw new Error('Upload to R2 failed.');
			}

			toast.dismiss();
			toast.success('Photo saved successfully!');
		} catch (error) {
			console.error('Error saving photo:', error);
			toast.dismiss();
			toast.error('Failed to save photo.');
		}
	};
</script>

<Toaster richColors expand={true} visibleToasts={1} position="bottom-right" />

<svelte:head>
	<title>CloudCam</title>
	<meta
		name="description"
		content="CloudCam is a camera app that saves photos and videos directly to the cloud, so you never run out of space and can access your memories anywhere."
	/>

	<meta property="og:title" content="CloudCam" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://cloudcam.wurks.studio/ogimage.png" />
	<meta property="og:url" content="https://cloudcam.wurks.studio/" />
	<meta
		property="og:description"
		content="CloudCam is a camera app that saves photos and videos directly to the cloud, so you never run out of space and can access your memories anywhere."
	/>
</svelte:head>

<div class="">
	<!-- <h1 class="text-4xl tracking-tight font-medium text-blue-400">Cloud<span class="text-gray-600">Cam</span></h1> -->

	<div class="my-4 flex space-x-4">
		<button
			class="m-2 my-4 w-full cursor-pointer rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black px-12 py-6 text-sm leading-4 font-light tracking-tight"
			onclick={takePhoto}
		>
			Click Photo
		</button>
		<a
			href="/gallery"
			class="m-2 my-4 w-full cursor-pointer rounded-2xl bg-white dark:bg-slate-900 px-12 py-6 text-sm leading-4 font-light tracking-tight text-black dark:text-white shadow-md/2"
		>
			View Photos
		</a>
	</div>

	<!-- <button class="m-2 my-4 cursor-pointer px-6 py-2 bg-gradient-to-br from-blue-200 to-gray-50 border border-gray-300 rounded-xl" on:click={takePhoto}> Click </button> -->

	{#if photoUrl}
		<div class="mx-auto mt-6">
			<img
				src={photoUrl}
				alt="Display the taken photograph"
				class=" mx-auto h-auto max-w-10/12 rounded-xl border border-gray-500"
			/>
		</div>
		<button
			class="m-2 mx-auto mt-4 w-2/3 cursor-pointer text-white dark:text-black rounded-2xl bg-gradient-to-br from-gray-950 to-slate-900 dark:from-white  dark:to-gray-200 px-12 py-4 text-sm leading-4 font-light tracking-tight"
			onclick={savePhoto}
		>
			Save Photo
		</button>
		<button
			class="m-2 mx-auto my-2 w-2/3 cursor-pointer rounded-2xl bg-gray-100 dark:bg-gray-900/50 px-12 py-4 text-sm leading-4 font-light tracking-tight text-black dark:text-white"
			onclick={takePhoto}
		>
			Click Another
		</button>
	{/if}

	<!-- {#if message}
		<div
			class="mt-6 rounded-lg border border-red-600 bg-red-500/10 p-4 text-sm text-red-700 dark:border-red-500 dark:bg-red-900/30 dark:text-red-300"
			role="alert"
		>
			<p>{message}</p>
		</div>
	{/if} -->
</div>
