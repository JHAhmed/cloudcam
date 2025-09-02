// routes/gallery/+page.js
import { supabase } from '$lib/supabaseClient';

export const load = () => {
    const fetchImages = async () => {
        const { data, error } = await supabase
            .from('images')
            .select('*');

        if (error) {
            console.error('Error fetching images:', error);
            throw new Error('Could not fetch gallery images.');
        }

        return data ?? [];
    };

    return {
        images: fetchImages()
    };
};