// src/routes/api/auth/[...kindeAuth]/+server.ts
import {handleAuth} from "@kinde-oss/kinde-auth-sveltekit";

export function GET(requestEvents) {
	return handleAuth(requestEvents);
};