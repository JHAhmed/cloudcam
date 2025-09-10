// src/lib/stores/authStore.js
import { writable } from 'svelte/store';

// The store will hold an object with the user data and a loading state.
// isLoading: true initially, so we can show a loader while checking the session.
// user: null, as we don't know if they're logged in yet.
export const stateStore = writable({
	isLoading: true,

	user: null,
    userId: null,
    username: "User",
    
    theme: "dark",
    imagePersistence: "on",
});