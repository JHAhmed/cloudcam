// import { sessionHooks, kindeAuthClient } from "@kinde-oss/kinde-auth-sveltekit";
// import { appwrite } from '$lib/server/appwrite';
// import { Query } from 'node-appwrite';

// async function syncUserToAppwrite(kindeUser) {
//     if (!kindeUser) return;

//     try {
//         // 1. Try to GET the user directly by ID. This is much faster than a query.
//         await appwrite.tablesDB.getRow("users", "users", kindeUser.id);

//     } catch (error) {
//         // 2. If it fails with a 404 (Not Found), it means the user doesn't exist. Create them.
//         if (error.code === 404) {
//             console.log(`Creating new Appwrite user and settings for Kinde user: ${kindeUser.id}`);
//             // Use Promise.all to create the user and their default settings in parallel.
//             await Promise.all([
//                 appwrite.tablesDB.createRow(
//                     "users", "users", kindeUser.id,
//                     {
//                         userId: kindeUser.id,
//                         email: kindeUser.email,
//                         given_name: kindeUser.given_name,
//                         family_name: kindeUser.family_name,
//                         picture: kindeUser.picture
//                     }
//                 ),
//                 appwrite.tablesDB.createRow(
//                     "users", "settings", kindeUser.id,
//                     {
//                         userId: kindeUser.id,
//                         theme: 'dark',
//                         instantUpload: 'off',
//                         imagePersistence: "on"
//                     }
//                 )
//             ]);
//         } else {
//             // 3. If it's another error, log it.
//             console.error('Error syncing user to Appwrite:', error);
//         }
//     }
// }

// export const handle = async ({ event, resolve }) => {
//     sessionHooks({ event }); // Kinde's required session handling

//     try {
//         const isAuthenticated = await kindeAuthClient.isAuthenticated(event.request);
//         event.locals.isAuthenticated = isAuthenticated;

//         if (isAuthenticated) {
//             const kindeUser = await kindeAuthClient.getUser(event.request);
//             event.locals.user = kindeUser;

//             // --- OPTIMIZATION START ---
//             // Run all independent database operations in parallel.
//             const [_, settings] = await Promise.all([
//                 syncUserToAppwrite(kindeUser), // This checks and creates the user if needed.
//                 appwrite.tablesDB.getRow("users", "settings", kindeUser.id) // This fetches settings.
//             ]);

//             event.locals.settings = settings;
//             // --- OPTIMIZATION END ---

//         } else {
//             // Set defaults for unauthenticated users.
//             event.locals.user = null;
//             event.locals.settings = { theme: 'dark', imagePersistence: 'on', instantUpload: 'off' };
//         }
//     } catch (error) {
//         // This catch block is important. If getRow fails because the settings don't exist yet
//         // (e.g., for a brand new user created in syncUserToAppwrite), this will catch it.
//         // We can safely assume default settings in that case.
//         if (error.code === 404) {
//             console.log("Settings not found for user, using defaults.");
//             event.locals.settings = { theme: 'dark', imagePersistence: 'on', instantUpload: 'off' };
//         } else {
//             console.error("Error in handle hook:", error);
//             event.locals.isAuthenticated = false;
//             event.locals.user = null;
//             event.locals.settings = { theme: 'dark', imagePersistence: 'on', instantUpload: 'off' };
//         }
//     }

//     return resolve(event);
// };

// src/hooks.server.js
import { sessionHooks, kindeAuthClient } from '@kinde-oss/kinde-auth-sveltekit';

// The handle hook is now much simpler!
export const handle = async ({ event, resolve }) => {
    sessionHooks({ event }); // Kinde's required session handling

    // We only determine if the user is authenticated here.
    // All other data will be loaded in the root layout.
    try {
        event.locals.isAuthenticated = await kindeAuthClient.isAuthenticated(event.request);
        if (event.locals.isAuthenticated) {
            event.locals.user = await kindeAuthClient.getUser(event.request);
        } else {
            event.locals.user = null;
        }
    } catch (error) {
        console.error("Error in handle hook:", error);
        event.locals.isAuthenticated = false;
        event.locals.user = null;
    }

    return resolve(event);
};