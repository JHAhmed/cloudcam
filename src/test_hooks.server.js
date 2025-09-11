// src/hooks.server.ts
import { sessionHooks, kindeAuthClient } from "@kinde-oss/kinde-auth-sveltekit";
import { appwrite } from '$lib/server/appwrite';
import { Query } from 'node-appwrite';

/**
 * Syncs the Kinde user to the Appwrite database.
 * This function is now more efficient as it's called only when needed.
 */
async function syncUserToAppwrite(kindeUser) {
    if (!kindeUser) return;

    try {
        const existingUsers = await appwrite.tablesDB.listRows(
            "users",
            "users",
            [Query.equal('userId', kindeUser.id)]
        );

        if (existingUsers.total === 0) {
            console.log(`Creating new Appwrite user for Kinde user: ${kindeUser.id}`);
            // Use Promise.all to run non-dependent database creations in parallel
            await Promise.all([
                appwrite.tablesDB.createRow(
                    "users", "users", kindeUser.id,
                    {
                        userId: kindeUser.id,
                        email: kindeUser.email,
                        given_name: kindeUser.given_name,
                        family_name: kindeUser.family_name,
                        picture: kindeUser.picture
                    }
                ),
                appwrite.tablesDB.createRow(
                    "users", "settings", kindeUser.id,
                    {
                        userId: kindeUser.id,
                        theme: 'dark',
                        imagePersistence: "on"
                    }
                )
            ]);
        }
    } catch (error) {
        console.error('Error syncing user to Appwrite:', error);
    }
}

export const handle = async ({ event, resolve }) => {
    sessionHooks({ event }); // Kinde's required session handling

    try {
        // Step 1: Check authentication status ONCE.
        const isAuthenticated = await kindeAuthClient.isAuthenticated(event.request);
        event.locals.isAuthenticated = isAuthenticated;

        if (isAuthenticated) {
            // Step 2: If authenticated, get user details ONCE.
            const kindeUser = await kindeAuthClient.getUser(event.request);
            event.locals.user = kindeUser;

            // Step 3: Sync user to Appwrite (this logic is smart and only creates if needed).
            await syncUserToAppwrite(kindeUser);

            // Step 4: Fetch user settings from Appwrite ONCE.
            const settings = await appwrite.tablesDB.getRow("users", "settings", kindeUser.id);
            event.locals.settings = settings;
        } else {
            // Step 5: Set defaults for unauthenticated users.
            event.locals.user = null;
            event.locals.settings = { theme: 'dark', imagePersistence: 'on' };
        }
    } catch (error) {
        // Handle potential errors during auth/data fetching
        console.error("Error in handle hook:", error);
        event.locals.isAuthenticated = false;
        event.locals.user = null;
        event.locals.settings = { theme: 'dark', imagePersistence: 'on' };
    }

    // Step 6: Resolve the request with all data populated in locals.
    return resolve(event);
};