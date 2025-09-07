// import { kindeAuthClient } from '@kinde-oss/kinde-auth-sveltekit';

// export const load = async ({ request }) => {
//     const isAuthenticated = await kindeAuthClient.isAuthenticated(request);
//     if (!isAuthenticated) {
//         return {
//             isAuthenticated: false,
//             user: null
//         };
//     }
    
//     const user = await kindeAuthClient.getUser(request);

//     return {
//         user
//     };
// };