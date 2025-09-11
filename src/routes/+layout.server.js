export async function load({ locals, url }) {
    return {
        isAuthenticated: locals.isAuthenticated,
        user: locals.user,
        settings: locals.settings,
        url: url.pathname
    };
}