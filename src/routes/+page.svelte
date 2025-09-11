<script>
	import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
	import { Toaster, toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import { userState } from '$lib/state.svelte.js';

	let { data } = $props();

	let photoUrl = $state(null);
	let message = $state('');
	let photoData = $state(null); // To store the base64 string and format

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

	function base64ToBlob(base64, contentType = '') {
		const byteCharacters = atob(base64);
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length; offset += 512) {
			const slice = byteCharacters.slice(offset, offset + 512);
			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		return new Blob(byteArrays, { type: contentType });
	}




	const takePhoto = async () => {
		try {
			const image = await Camera.getPhoto({
				quality: 99,
				// allowEditing: true,  // Uncomment if needed
				resultType: CameraResultType.Base64,  // Change to Base64
				source: CameraSource.Camera
			});

			// Now image.base64String holds the data
			photoUrl = `data:${image.format};base64,${image.base64String}`;
			// return image.base64String;  // Return it for use in savePhoto
			photoData = {
				base64String: image.base64String,
				format: image.format
			};
		} catch (e) {
			console.error('Error taking photo', e);
			return null;
		}
	};


const savePhoto = async () => {
    // 1. Check if a photo has been taken
    if (!photoData || !photoData.base64String) {
        toast.error('Please take a photo first.');
        return;
    }

    toast.loading('Saving image...');

    try {
        // 2. Convert the Base64 string to a Blob
        const photoBlob = base64ToBlob(photoData.base64String, `image/${photoData.format}`);

        // 3. Create a unique file name for the image
        const fileName = `photo_${Date.now()}.${photoData.format}`;

        // 4. Get a pre-signed URL (this part remains the same)
        const presignedUrlResponse = await fetch('/api/get-upload-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fileName: fileName,
                fileType: photoBlob.type,
                userId: userId
            })
        });

        if (!presignedUrlResponse.ok) {
            throw new Error('Failed to get an upload URL.');
        }

        const { url: presignedUrl } = await presignedUrlResponse.json();

        // 5. Upload the blob (this part also remains the same)
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

        // Optional: Clear the photo data after successful upload
        photoData = null;

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
