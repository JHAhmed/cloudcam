import { json } from '@sveltejs/kit';
import { appwrite } from '$lib/server/appwrite';
import { kindeAuthClient } from '@kinde-oss/kinde-auth-sveltekit';

export async function POST({ request, locals }) {
    // 1. Check if user is authenticated
    const isAuthenticated = await kindeAuthClient.isAuthenticated(request);
    
    if (!isAuthenticated) {
        return json({ error: 'Not authorized' }, { status: 401 });
    }

    // // 2. Get the new settings from the request body
    const { theme, imagePersistence } = await request.json();
    const user = await kindeAuthClient.getUser(request);

    // // 3. (Optional but recommended) Validate the incoming data
    // if (typeof theme !== 'string' || typeof notificationsEnabled !== 'boolean') {
    //     return json({ error: 'Invalid data provided' }, { status: 400 });
    // }

    // 4. Update the user's document in Appwrite
    try {
        await appwrite.tablesDB.updateRow(
            "users",
            "settings",
            user.id,
            {
                theme,
                imagePersistence
            }
        );

        // return json({ success: true, message: 'Settings saved!' });
        return json({ success: true, message: 'Settings saved!' });

    } catch (error) {
        console.error('Failed to update settings:', error);
        return json({ error: 'Failed to save settings' }, { status: 500 });
    }
}