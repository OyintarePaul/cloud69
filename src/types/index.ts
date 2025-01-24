import { Models } from "appwrite";

export type Resource = {
  name: string;
  parentID: string;
  userID: string;
  trash?: boolean;
  type: "file" | "folder";
  size?: number;
  mimeType?: string;
  favourite?: boolean;
  firebase_storage_path?: string;
};

export type AppwriteDocument = Models.Document & Resource;
