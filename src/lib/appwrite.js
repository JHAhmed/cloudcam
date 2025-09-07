import { Client, TablesDB, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("cloudcam"); // Replace with your project ID

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
