import { Client, Account, Databases } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export { ID, Query } from "appwrite";
export const dbID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const resourcesCollectionID = import.meta.env
  .VITE_APPWRITE_RESOURCES_COLLECTION_ID;
