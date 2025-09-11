import { json } from '@sveltejs/kit';
import { appwrite } from '$lib/server/appwrite';
import { kindeAuthClient } from '@kinde-oss/kinde-auth-sveltekit';

import { env } from '$env/dynamic/private';

async function getManagementApiToken() {
	const issuerUrl = env.KINDE_ISSUER_URL;
	const clientId = env.KINDE_M2M_CLIENT_ID;
	const clientSecret = env.KINDE_M2M_CLIENT_SECRET;

	if (!issuerUrl || !clientId || !clientSecret) {
		throw new Error('Missing Kinde environment variables for M2M');
	}

	const response = await fetch(`${issuerUrl}/oauth2/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'client_credentials',
			client_id: clientId,
			client_secret: clientSecret,
			audience: `${issuerUrl}/api` // Audience for Kinde Management API
		})
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to get Management API token: ${errorText}`);
	}

	const { access_token } = await response.json();
	return access_token;
}

export async function POST({ request, locals, cookies }) {
	// 1. Check if user is authenticated
	const isAuthenticated = await kindeAuthClient.isAuthenticated(request);

	if (!isAuthenticated) {
		return json({ error: 'Not authorized' }, { status: 401 });
	}

	// // 2. Get the new settings from the request body
	const { username } = await request.json();
	const user = await kindeAuthClient.getUser(request);

	let hasDigits = /\d/.test(username);
	if (typeof username !== 'string' || username.length < 3 || hasDigits) {
		return json(
			{ error: 'Invalid username. Must be at least 3 characters long and contain no digits.' },
			{ status: 400 }
		);
	}

	// 3. Get Management API token and update the user's given_name in Kinde
	try {
		const managementToken = await getManagementApiToken();

		const response = await fetch(`${env.KINDE_ISSUER_URL}/api/v1/user?id=${user.id}`, {
			method: 'PATCH',
			headers: {
				Authorization: `Bearer ${managementToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				given_name: username
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('Failed to update user in Kinde:', errorText);
			throw new Error('Failed to update user in Kinde');
		}

		// 3.1. Refresh user claims to invalidate cache
		await fetch(`${env.KINDE_ISSUER_URL}/api/v1/users/${user.id}/refresh_claims`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${managementToken}`,
				Accept: 'application/json'
			}
		});

		await kindeAuthClient.getToken(request); 

	} catch (error) {
		console.error('Failed to update user in Kinde:', error);
		return json({ error: 'Failed to update user in Kinde' }, { status: 500 });
	}

	// 4. Update the user's document in Appwrite
	try {
		await appwrite.tablesDB.updateRow('users', 'users', user.id, {
			given_name: username
		});

		return json({ success: true, message: 'Settings saved!' });

	} catch (error) {
		console.error('Failed to update settings:', error);
		return json({ error: 'Failed to save settings' }, { status: 500 });
	}
}
