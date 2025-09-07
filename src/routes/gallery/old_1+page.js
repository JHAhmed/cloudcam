// routes/gallery/+page.js
import { supabase } from '$lib/supabaseClient';

export const load = () => {
    const fetchImages = async () => {
        // 1. List all files in the 'images' bucket.
        const { data: fileObjects, error: listError } = await supabase.storage
            .from('images') // Your bucket name
            .list(); // You can also specify a folder path here, e.g., .list('avatars')

        if (listError) {
            console.error('Error listing images:', listError);
            throw new Error('Could not list gallery images.');
        }

        // 2. Create a public URL for each image.
        const images = fileObjects.map((file) => {
            const { data } = supabase.storage
                .from('images') // Your bucket name
                .getPublicUrl(file.name); // Get the URL for the specific file

            return {
                name: file.name,
                id: file.id, // The file object has a unique ID
                url: data.publicUrl,
            };
        });

        return images ?? [];
    };

    return {
        images: fetchImages(),
    };
};