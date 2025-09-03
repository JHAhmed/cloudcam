<script>
	import { supabase } from '$lib/supabaseClient';
    import { FileTransfer } from '@capacitor/file-transfer';
    import { Filesystem, Directory } from '@capacitor/filesystem';
    import { Capacitor } from '@capacitor/core';

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
        const { data, error } = await supabase
        .storage
        .from('images')
        .remove([image.name])

        if (error) {
            console.error('Supabase delete error:', error);
            toast.error('Failed to delete image from storage');
            throw new Error(`Failed to delete image from storage: ${error.message}`);
        } else {
            console.log(data);
            console.log('Image deleted successfully');
            handleDelete(image.id);
        }
    }

    async function downloadPhoto() {
        // Check if running on a native platform
        if (!Capacitor.isNativePlatform()) {
            // 1. Fetch the image data from the URL
            const response = await fetch(image.url);
            // 2. Create a 'blob' from the response (a file-like object)
            const blob = await response.blob();
            // 3. Create a temporary, local URL for the blob
            const blobUrl = URL.createObjectURL(blob);

            // 4. Use the temporary URL to trigger the download
            const link = document.createElement('a');
            link.href = blobUrl;
            // Use the actual file name from your image object
            link.download = image.name;
            document.body.appendChild(link);
            link.click();

            // 5. Clean up by removing the link and revoking the temporary URL
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);

            toast.success('Image downloaded!');
            return;
        }

        // Native Platform Logic (Android/iOS)
        try {
            // The Filesystem plugin requires the raw base64 data, without the data URL prefix.
            // The prefix looks like "data:image/png;base64,". We must remove it.

            const response = await fetch(image.url);
            const blob = await response.blob();

            // 2. Convert the Blob to a Base64 string
            const base64Data = await blobToBase64(blob);

            const result = await Filesystem.writeFile({
                path: image.name, // The filename
                data: base64Data, // The raw base64 data
                directory: Directory.Documents, // Save to the device's Documents directory
            });

            console.log('File saved to:', result.uri);
            toast.success('Image saved to Documents!');

        } catch (error) {
            console.error('Error saving image:', error);
            toast.error('Could not save image.');
        }
    }
</script>

<Toaster richColors position="bottom-right" />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	onclick={handleBackdropClick}
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
>
	<div class="mx-auto my-auto flex h-fit w-3/4 flex-col items-center justify-center gap-2">
		<img
			src={image.url}
			alt="Selected item from gallery"
			class="h-fit md:h-[30rem] w-fit rounded-lg"
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
				class="w-full cursor-pointer rounded-xl bg-red-500/60 px-12 py-4 text-sm leading-4 font-light tracking-tight text-white"
				onclick={deletePhoto}
			>
				Delete
			</button>
		</div>
	</div>
</div>
