import { kindeAuthClient } from '@kinde-oss/kinde-auth-sveltekit';
import { appwrite } from '$lib/server/appwrite';

export async function load({ request, url, locals }) { 
    const isAuthenticated = await kindeAuthClient.isAuthenticated(request);
    const defaultSettings = { theme: 'dark', imagePersistence: 'on' };

    if (isAuthenticated) {
        const user = await kindeAuthClient.getUser(request);
        let settings = locals.cachedSettings; 

        if (!settings) {
            settings = await appwrite.tablesDB.getRow("users", "settings", user.id);
            locals.cachedSettings = settings || defaultSettings; 
        }

        return { isAuthenticated, settings, user, url: url.pathname };
    }

    return { isAuthenticated, user: null, settings: defaultSettings, url: url.pathname };
};
