import { kindeAuthClient } from '@kinde-oss/kinde-auth-sveltekit';
import { appwrite } from '$lib/server/appwrite';

export async function load({ request, url }) {
	const isAuthenticated = await kindeAuthClient.isAuthenticated(request); // Boolean: true or false

    const defaultSettings = {
        theme: 'dark',
        imagePersistence: "on"
    };

	if (isAuthenticated) {
		const user = await kindeAuthClient.getUser(request);

        const settings = await appwrite.tablesDB.getRow(
			"users",
            "settings",
            user.id
        );

		return {
			isAuthenticated,
			settings: settings || defaultSettings,
			user,
			url: url.pathname
		};
	} 

	return {
		isAuthenticated,
		user: null,
		settings: defaultSettings,
		url: url.pathname
	};
}
