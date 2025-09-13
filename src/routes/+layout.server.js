// export async function load({ locals, url }) {
//     return {
//         isAuthenticated: locals.isAuthenticated,
//         user: locals.user,
//         settings: locals.settings,
//         url: url.pathname
//     };
// }

// src/routes/+layout.server.js
import { appwrite } from '$lib/server/appwrite';

async function syncUserToAppwrite(kindeUser) {
    if (!kindeUser) return;

    try {
        await appwrite.tablesDB.getRow("users", "users", kindeUser.id);
    } catch (error) {
        if (error.code === 404) {
            console.log(`Creating new Appwrite user and settings for Kinde user: ${kindeUser.id}`);
            // Fire-and-forget these promises. We don't need to wait for them
            // to finish for the page to load. This makes the UI feel faster.
            Promise.all([
                appwrite.tablesDB.createRow("users", "users", kindeUser.id, {
                    userId: kindeUser.id,
                    email: kindeUser.email,
                    given_name: kindeUser.given_name,
                    family_name: kindeUser.family_name,
                    picture: kindeUser.picture
                }),
                appwrite.tablesDB.createRow("users", "settings", kindeUser.id, {
                    userId: kindeUser.id,
                    theme: 'dark',
                    instantUpload: 'off',
                    imagePersistence: "on"
                })
            ]).catch(console.error); // Log errors if the background sync fails
        } else {
            console.error('Error syncing user to Appwrite:', error);
        }
    }
}


export async function load({ locals, url }) {
    const defaultSettings = { theme: 'dark', imagePersistence: 'on', instantUpload: 'off' };

    if (locals.isAuthenticated && locals.user) {
        // Run the sync in the background. Don't await it!
        // This prevents the sync process from blocking the page render.
        syncUserToAppwrite(locals.user);

        try {
            // Fetch the settings only once here.
            const settings = await appwrite.tablesDB.getRow("users", "settings", locals.user.id);
            return {
                isAuthenticated: locals.isAuthenticated,
                user: locals.user,
                settings: settings, // Pass the fetched settings
                url: url.pathname
            };
        } catch (error) {
            if (error.code === 404) {
                // Settings don't exist yet (for a new user), use defaults.
                // The syncUser function will create them in the background.
                return {
                    isAuthenticated: locals.isAuthenticated,
                    user: locals.user,
                    settings: defaultSettings,
                    url: url.pathname
                };
            }
            // Handle other potential errors
            console.error("Error fetching settings in root layout:", error);
        }
    }

    // Return data for unauthenticated users
    return {
        isAuthenticated: false,
        user: null,
        settings: defaultSettings,
        url: url.pathname
    };
}