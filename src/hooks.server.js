// src/hooks.server.ts
import { sessionHooks, kindeAuthClient } from "@kinde-oss/kinde-auth-sveltekit"; 

import { appwrite } from '$lib/server/appwrite';
import { Query } from 'node-appwrite';


// export const handle = async ({ event, resolve }) => {
// 	sessionHooks({ event });
// 	const response = await resolve(event);
// 	return response;
// };


async function syncUserToAppwrite(kindeUser) {
    if (!kindeUser) return;

    try {
        // 1. Check if the user already exists in our Appwrite collection
        const existingUsers = await appwrite.tablesDB.listRows(
            "users",
            "users",
            [Query.equal('userId', kindeUser.id)]
        );

        // 2. If the user does not exist, create them
        if (existingUsers.total === 0) {
            console.log(`Creating new Appwrite user for Kinde user: ${kindeUser.id}`);
            await appwrite.tablesDB.createRow(
                "users",
                "users",
                kindeUser.id, // Using Kinde ID as the Appwrite Document ID for uniqueness
                {
                    userId: kindeUser.id,
                    email: kindeUser.email,
                    given_name: kindeUser.given_name,
                    family_name: kindeUser.family_name,
					picture: kindeUser.picture	
                }
            );

            await appwrite.tablesDB.createRow(
                "users",
                "settings",
                kindeUser.id, // Use the SAME Kinde ID as the document ID
                {
                    userId: kindeUser.id, // Store the ID as an attribute for linking
                    theme: 'dark', // Your default theme
                    imagePersistence: "on" // Your default image persistence preference
                }
            );
        }
        // Optional: If the user exists, you could add logic here to update their
        // details if they've changed in Kinde (e.g., name or picture).

    } catch (error) {
        console.error('Error syncing user to Appwrite:', error);
    }
}

// export const handle = async ({ event, resolve }) => {
//     sessionHooks({ event });

// 	const isAuthenticated = await kindeAuthClient.isAuthenticated(event.request);
    
// 	if (isAuthenticated && !event.locals.isAppwriteUserSynced) {
// 		const user = await kindeAuthClient.getUser(event.request);
//         await syncUserToAppwrite(user);
        
//         event.locals.isAppwriteUserSynced = true; 
//     }
	
// 	const response = await resolve(event);
// 	return response;

// };

export const handle = async ({ event, resolve }) => {
    sessionHooks({ event });

    const isAuthenticated = await kindeAuthClient.isAuthenticated(event.request);
    
    if (isAuthenticated) {
        const user = await kindeAuthClient.getUser(event.request);
        // Check a cookie or local flag before syncing
        if (!event.cookies.get('appwrite_synced')) {
            await syncUserToAppwrite(user);
            event.cookies.set('appwrite_synced', 'true', { path: '/', maxAge: 3600 }); // Expires in 1 hour
        }
        event.locals.isAppwriteUserSynced = true;
    }
    
    const response = await resolve(event);
    return response;
};
