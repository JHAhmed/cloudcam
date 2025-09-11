<script>
	import { onMount, onDestroy } from 'svelte';
	import { App } from '@capacitor/app';
	import Modal from '$lib/components/Modal.svelte';
	import { Toaster, toast } from 'svelte-sonner';
	import { animateIn } from '$lib';

	import Icon from '@iconify/svelte';

	let { data } = $props();

	let isModal = $state(false);
	let modalImage = $state(null);
	let backButtonListener = $state(null);

    let displayedImages = $state(null);

	let isLoading = $state(false);
    let error = $state(null);

	let columns = $state(3);
	let gap = $state(3);

    
    $effect(() => {
        isLoading = true;
        data.images
            .then(resolvedImages => {
                displayedImages = resolvedImages;
            })
            .catch(err => {
                console.error("Failed to load images:", err);
                error = err;
            })
            .finally(() => {
                isLoading = false;
            });
    });

	onMount(async () => {
		backButtonListener = await App.addListener('backButton', (event) => {
			if (isModal) {
				closeModal();
				event.preventDefault();
			} else {
				event.preventDefault();
				if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
					window.history.back();
				} else {
					App.exitApp();
				}
			}
		});
	});

	onDestroy(async () => {
		if (backButtonListener) {
			await backButtonListener.remove();
		}
	});

    function handleDelete(key) {
        closeModal();
        toast.success('Image deleted successfully!');
        displayedImages = displayedImages.filter((image) => image.key !== key);
    }

	function openModal(image) {
		modalImage = image;
		isModal = true;
	}

	function closeModal() {
		isModal = false;
		modalImage = null;
	}

	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}

	function handleGap(num) {
		  if (num >= 1 && num <= 5) {
			return 6 - num;
		}
	}

	const increaseColumns = () => {
		columns < 4 ? columns++ : null;
	};

	const decreaseColumns = () => {
		columns > 1 ? columns-- : null;
	};
</script>

<svelte:head>
	<title>Gallery | CloudCam</title>
	<meta name="description" content="View your images stored in CloudCam's gallery." />

	<meta property="og:title" content="Gallery | CloudCam" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://cloudcam.wurks.studio/ogimage.png" />
	<meta property="og:url" content="https://cloudcam.wurks.studio/gallery/" />
	<meta
		property="og:description"
		content="View your images stored in CloudCam's gallery."
	/>
</svelte:head>

<Toaster richColors position="bottom" />

<div class="my-4 p-4">
	<div class="flex items-center mb-6 justify-between">
		<h1 class="text-left text-3xl font-normal text-black dark:text-white">Gallery</h1>

		<div class="flex space-x-2">
			<button onclick={decreaseColumns} use:animateIn={{ delay: 0.2, blur: 4 }} class="flex cursor-pointer size-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700">
				<Icon icon="ph:plus" class="size-5 text-black dark:text-white" />
			</button>
			<button onclick={increaseColumns} use:animateIn={{ delay: 0.4, blur: 4 }} class="flex cursor-pointer size-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700">
				<Icon icon="ph:minus" class="size-5 text-black dark:text-white" />
			</button>
		</div>
	</div>

	{#await data.images}
		<div class="columns-2 gap-1 md:columns-3 md:gap-2 rounded-lg">
			{#each Array(5) as _}
				<div class="mb-1 md:mb-2 h-48 animate-pulse break-inside-avoid rounded-lg bg-gray-200 dark:bg-gray-700"></div>
			{/each}
		</div>
	{:then images}
		{#if images && images.length > 0}
			<div class="{`columns-${columns}`} {`gap-1 md:gap-${6 - columns - 1}`}">
				<!-- {#each images as image, i} -->
				{#each displayedImages as image, i}
					<div class="{`mb-1 md:mb-${6 - columns - 1}`} break-inside-avoid">
						<button onclick={() => openModal(image)} class="w-full flex h-full m-0 p-0">
							<img
								src={image.url}
								alt="A gallery item"
								class="h-auto w-full rounded-md md:rounded-lg object-cover shadow-lg/5 dark:shadow-md m-0 p-0"
								loading="lazy"
							/>
						</button>
					</div>
				{/each}
			</div>
		{:else}
			<Icon icon="ph:file-image-thin" class="mx-auto mt-2 size-12 mb-2 text-gray-400" />
			<p class="text-gray-400">No images found in the gallery.</p>
		{/if}
	{:catch error}
		<p class="text-red-400">Error: {error.message}</p>
	{/await}

	{#if isModal}
		<Modal image={modalImage} {handleDelete} {handleBackdropClick} />
	{/if}
</div>

