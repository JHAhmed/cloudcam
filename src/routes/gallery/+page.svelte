<script>
	import { onMount, onDestroy } from 'svelte';
	import { App } from '@capacitor/app';
	import Modal from '$lib/components/Modal.svelte';
	import { Toaster, toast } from 'svelte-sonner';

	let { data } = $props();

	// let images = $state(data.images);

	let isModal = $state(false);
	let modalImage = $state(null);
	let backButtonListener = $state(null);


    // STATE: This will be the single source of truth for the images shown in the UI.
    let displayedImages = $state(null);
    // STATE: To manage the loading and error states without an #await block.
    let isLoading = $state(true);
    let error = $state(null);

    // EFFECT: This runs when the component mounts. It resolves the data promise
    // and populates our reactive 'displayedImages' state.
    $effect(() => {
        isLoading = true;
        data.images
            .then(resolvedImages => {
                displayedImages = resolvedImages;
				console.log(resolvedImages);
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

    function handleDelete(id) {
        closeModal();
        toast.success('Image deleted successfully!');
        displayedImages = displayedImages.filter((image) => image.id !== id);
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
</script>

<svelte:head>
	<title>Gallery | CloudCam</title>
	<meta name="description" content="View your images stored in CloudCam's gallery." />

	<meta property="og:title" content="Gallery | CloudCam" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://cloudcambywurks.vercel.app/ogimage.png" />
	<meta property="og:url" content="https://cloudcambywurks.vercel.app/gallery/" />
	<meta
		property="og:description"
		content="View your images stored in CloudCam's gallery."
	/>
</svelte:head>

<Toaster richColors position="bottom-right" />

<div class="my-4 p-4">
	<h1 class="mb-6 text-left text-3xl font-normal text-white">Gallery</h1>

    {#if isLoading}
        <div class="columns-2 gap-2 md:columns-3 md:gap-4 rounded-lg">
            {#each Array(5) as _}
                <div class="mb-2 h-48 animate-pulse break-inside-avoid rounded-lg bg-gray-700"></div>
            {/each}
        </div>
    {:else if error}
        <p class="text-red-400">Error: {error.message}</p>
    {:else if displayedImages && displayedImages.length > 0}
        <div class="columns-2 gap-2 md:columns-3 md:gap-4">
            {#key displayedImages}
                {#each displayedImages as image (image.id)}
                    <div class="mb-1 md:mb-3 break-inside-avoid">
                        <button onclick={() => openModal(image)} class="w-full">
                            <img
                                src={image.url}
                                alt="A gallery item"
                                class="h-auto w-full rounded-lg object-cover shadow-md"
                                loading="lazy"
                            />
                        </button>
                    </div>
                {/each}
            {/key}
        </div>
    {:else}
        <p>No images found in the gallery.</p>
    {/if}

	{#if isModal}
		<Modal image={modalImage} {handleDelete} {handleBackdropClick} />
	{/if}
</div>
