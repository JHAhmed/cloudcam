import { kindeAuthClient } from '@kinde-oss/kinde-auth-sveltekit';

export async function load({ request }) {
	const isAuthenticated = await kindeAuthClient.isAuthenticated(request); // Boolean: true or false

	  if (isAuthenticated) {
	    const user = await kindeAuthClient.getUser(request);
      return {
        isAuthenticated,
        user
      };
	  } else {
	    // Need to implement, e.g: redirect user to sign in, etc..
	  }


	return {
		isAuthenticated,
		// user
	};
}
