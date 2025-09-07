import { ID, Query } from 'appwrite';
import { tablesDB } from '$lib/appwrite';

const USERS_DATABASE_ID = 'users'; // Replace with your database ID
const PREFERENCES_TABLE_ID = 'preferences'; // Replace with your table ID

export async function getPreferenceByUserId(userId) {
	const result = await tablesDB.listRows(
		USERS_DATABASE_ID,
		PREFERENCES_TABLE_ID,
		[Query.equal('userId', userId)]
	);
	return result.rows[0]; // Assuming userId is unique, return the first match
}

export async function getPreferences() {
	return await tablesDB.listRows(
		USERS_DATABASE_ID,
		PREFERENCES_TABLE_ID,
		// Use a query to show the latest ideas first
		[Query.orderDesc('$createdAt')]
	);
}

export async function addPreference(userId, imagePersistence, allowGallery) {
	await tablesDB.createRow(USERS_DATABASE_ID, PREFERENCES_TABLE_ID, userId, {
		userId,
		imagePersistence,
		allowGallery
	});
}

export async function updatePreference(id, updates) {
    await tablesDB.updateRow(USERS_DATABASE_ID, PREFERENCES_TABLE_ID, id, updates);
}

// export async function deletePreference(id) {
// 	await tablesDB.deleteRow(USERS_DATABASE_ID, PREFERENCES_TABLE_ID, id);
// }
