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

	let isLoading = $state(true);
    let error = $state(null);

	let columns = $state(3);

    // EFFECT: This runs when the component mounts. It resolves the data promise
    // and populates our reactive 'displayedImages' state.
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

<Toaster richColors position="bottom-right" />

<div class="my-4 p-4">
	<div class="flex items-center mb-6 justify-between">
		<h1 class="text-left text-3xl font-normal text-white">Gallery</h1>

		<div class="flex space-x-2">
			<button onclick={decreaseColumns} use:animateIn={{ delay: 0.2, blur: 4 }} class="flex size-8 items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700">
				<Icon icon="ph:plus" class="size-5 text-white" />
			</button>
			<button onclick={increaseColumns} use:animateIn={{ delay: 0.4, blur: 4 }} class="flex size-8 items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700">
				<Icon icon="ph:minus" class="size-5 text-white" />
			</button>
		</div>
	</div>

    {#if isLoading}
        <div class="columns-2 gap-2 md:columns-3 md:gap-2 rounded-lg">
            {#each Array(5) as _}
                <div class="mb-2 h-48 animate-pulse break-inside-avoid rounded-lg bg-gray-700"></div>
            {/each}
        </div>
    {:else if error}
        <p class="text-red-400">Error: {error.message}</p>
    {:else if displayedImages && displayedImages.length > 0}
	        <div class="{`columns-${columns}`} gap-2 md:gap-4">
	            {#key displayedImages}
	                {#each displayedImages as image, i}
	                    <div use:animateIn={{ delay: i * 0.2 }} class="mb-1 md:mb-3 break-inside-avoid">
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


<!-- <style>
	.columns-1 {
  column-count: 1;
}
.columns-2 {
  column-count: 2;
}
.columns-3 {
  column-count: 3;
}
/* etc. */
</style> -->