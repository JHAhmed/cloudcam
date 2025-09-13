<script>
	import { onMount } from 'svelte';
	import { Toaster, toast } from 'svelte-sonner';
	import { userState } from '$lib/state.svelte.js';
	import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

	let { data } = $props();

	let photoUrl = $state(null);
	let userId = $state(null);
	let imageKey = $state('');

	let uploading = $state(false);
	let instantUpload = $state(true);

	onMount(() => {
		data.user.id ? (userId = data.user.id) : console.log('No user ID found.');
		if (userState.instantUpload) {
			userState.instantUpload === 'on' ? (instantUpload = 'on') : (instantUpload = 'off');
		} else {
			instantUpload = 'off';
		}
	});

	const takePhoto = async () => {
		try {
			const image = await Camera.getPhoto({
				quality: 99,
				resultType: CameraResultType.Uri,
				source: CameraSource.Camera
			});

			photoUrl = image.webPath;
			console.log(image);
			if (instantUpload == 'on') {
				uploading = true;
				await savePhoto();
			}
		} catch (e) {
			console.error('Error taking photo', e);
		}
	};

	async function deletePhoto() {
		console.log('Deleting photo with key:', imageKey);
		const response = await fetch('/api/delete-image', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ fileKey: imageKey })
		});

		if (!response.ok) {
			console.error('Error deleting file');
			toast.error('Failed to delete image from storage');
		} else {
			toast('Image deleted from storage');
			photoUrl = null;
			imageKey = '';
		}
	}

	const savePhoto = async () => {
		if (!photoUrl) {
			toast.error('Please take a photo first.');
			return;
		}

		toast.loading('Saving image...');
		console.log('User ID:', userId);
		try {
			const response = await fetch(photoUrl);
			const photoBlob = await response.blob();

			const fileName = `photo_${Date.now()}`;

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

			const resData = await presignedUrlResponse.json();

			imageKey = resData.key;

			const uploadResponse = await fetch(resData.url, {
				method: 'PUT',
				body: photoBlob,
				headers: {
					'Content-Type': photoBlob.type
				}
			});

			if (!uploadResponse.ok) {
				throw new Error('Upload to R2 failed.');
			} else {
				console.log(uploadResponse);
			}

			toast.dismiss();
			uploading = false;
			toast.success('Photo saved successfully!');
		} catch (error) {
			console.error('Error saving photo:', error);
			toast.dismiss();
			toast.error('Failed to save photo.');
		}
	};
</script>

<Toaster richColors expand={true} visibleToasts={1} position="bottom" />

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
			class="m-2 my-4 w-full cursor-pointer rounded-2xl bg-slate-900 px-12 py-6 text-sm leading-4 font-light tracking-tight text-white dark:bg-white dark:text-black"
			onclick={takePhoto}
		>
			Click Photo
		</button>
		<a
			href="/gallery"
			class="m-2 my-4 w-full cursor-pointer rounded-2xl bg-white px-12 py-6 text-sm leading-4 font-light tracking-tight text-black shadow-md/2 dark:bg-slate-900 dark:text-white"
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
		{#if instantUpload == 'off'}
			<button
				class="m-2 mx-auto mt-4 w-2/3 cursor-pointer rounded-2xl bg-gradient-to-br from-gray-950 to-slate-900 px-12 py-4 text-sm leading-4 font-light tracking-tight text-white dark:from-white dark:to-gray-200 dark:text-black"
				onclick={savePhoto}
			>
				Save Photo
			</button>
		{:else}
			<button
				disabled={uploading}
				class="m-2 mx-auto mt-4 w-2/3 cursor-pointer rounded-2xl {uploading ? "bg-white/50" : "bg-red-500"} px-12 py-4 text-sm leading-4 font-light tracking-tight text-white dark:from-white dark:to-gray-200 dark:text-black"
				onclick={deletePhoto}
			>
				{uploading ? "Uploading..." : "Delete Photo"}
			</button>
		{/if}
		<button
			class="m-2 mx-auto my-2 w-2/3 cursor-pointer rounded-2xl bg-gray-100 px-12 py-4 text-sm leading-4 font-light tracking-tight text-black dark:bg-gray-900/50 dark:text-white"
			onclick={takePhoto}
		>
			Click Another
		</button>
	{/if}
</div>
