// +page.server.js
import { kindeAuthClient } from '@kinde-oss/kinde-auth-sveltekit';

// This function will fetch the data, but we won't await it in `load`
async function fetchUserImages(event, userId) {
    const response = await event.fetch('/api/fetch-images', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId })
    });
    if (!response.ok) {
        throw new Error('Failed to fetch images');
    }
    return response.json();
}

export const load = async (event) => {
    const user = await kindeAuthClient.getUser(event.request);

    // Return an object where `images` is a PROMISE, not the final data
    return {
        images: fetchUserImages(event, user.id)
    };
};