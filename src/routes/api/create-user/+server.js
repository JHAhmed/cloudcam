import { Client, Users } from "node-appwrite";
import { APPWRITE_API_KEY } from "$env/dynamic/private";

export async function POST({ request }) {
    const { userId, email, given_name } = await request.json();

    const client = new Client()
        .setEndpoint('https://fra.cloud.appwrite.io/v1') // Your API Endpoint
        .setProject('cloudcam') // Your project ID
        .setKey(APPWRITE_API_KEY); // Your secret API key

    const users = new Users(client);

    const result = await users.create({
        userId: userId,
        email: email, 
        name: given_name 
    });

    return new Response(JSON.stringify(result), { status: 200 });
}
