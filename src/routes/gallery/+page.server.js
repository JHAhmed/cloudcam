// // +page.server.js
// import { kindeAuthClient } from '@kinde-oss/kinde-auth-sveltekit';

// // This function will fetch the data, but we won't await it in `load`
// async function fetchUserImages(event, userId) {

//     const response = event.fetch('/api/fetch-images', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ userId: userId })
//     });
//     if (!response.ok) {
//         throw new Error('Failed to fetch images');
//     }
//     return response.json();
// }

// export const load = async (event) => {

//     const user = event.locals.user;
//     if (!user) {
//         return {
//             images: []
//         };
//     }
//     // Return an object where `images` is a PROMISE, not the final data
//     return {
//         images: fetchUserImages(event, user.id)
//     };
// };

// src/routes/gallery/+page.server.js (Simplified)
export const load = async (event) => {
    // We only need to know if there's a user.
    // The actual image data will be loaded on the client.
    if (!event.locals.user) {
        return { user: null, images: [] };
    }
    return {
        user: event.locals.user,
        images: [] // Return an empty array initially
    };
};