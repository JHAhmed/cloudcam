import { Client, TablesDB, ID, Query } from 'node-appwrite';
import {
    APPWRITE_API_KEY
} from '$env/static/private';

import { PUBLIC_APPWRITE_ENDPOINT, PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public'; 

// Initialize the Appwrite Client
const client = new Client()
    .setEndpoint(PUBLIC_APPWRITE_ENDPOINT)
    .setProject(PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

// Initialize the Appwrite services we'll use
export const tablesDB = new TablesDB(client);

// Expose a custom object for easier use
export const appwrite = {
    tablesDB,
    // Add other services like Users, Storage, etc. as needed
};