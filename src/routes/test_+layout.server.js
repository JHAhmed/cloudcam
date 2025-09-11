// src/routes/+layout.server.js
// No need for kindeAuthClient or appwrite here anymore!

export async function load({ locals, url }) {
    // Data is instantly available from the `handle` hook via `locals`.
    // No network requests are made here! ⚡️
    return {
        isAuthenticated: locals.isAuthenticated,
        user: locals.user,
        settings: locals.settings,
        url: url.pathname
    };
}