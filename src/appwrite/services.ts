import { AppwriteDocument, Resource } from "@/types";
import {
  account,
  databases,
  dbID,
  ID,
  Query,
  resourcesCollectionID,
} from "./init";
import * as mimeType from "@/lib/mime-types";
import { deleteFile } from "@/firebase/services";

export const createResource = async (payload: Resource) => {
  const result = await databases.createDocument(
    dbID,
    resourcesCollectionID,
    ID.unique(),
    payload
  );
  return result;
};

export const getChildren = async (parentID: string | undefined) => {
  const user = await account.get();
  if (!parentID || !user.$id) return;
  const result = await databases.listDocuments(dbID, resourcesCollectionID, [
    Query.equal("parentID", parentID),
    Query.equal("trash", false),
    Query.equal("userID", user.$id),
  ]);
  return result.documents as AppwriteDocument[];
};

export const moveToTrash = async (resourceID: string) => {
  await databases.updateDocument(dbID, resourcesCollectionID, resourceID, {
    trash: true,
  });
};

export const restoreFromTrash = async (resourceID: string) => {
  await databases.updateDocument(dbID, resourcesCollectionID, resourceID, {
    trash: false,
  });
};

export const deletePermanently = async (
  resourceID: string,
  path: string,
  type: string
) => {
  await databases.deleteDocument(dbID, resourcesCollectionID, resourceID);
  if (type == "file") await deleteFile(path);
};

export const toggleFavourites = async (
  resourceID: string,
  favourite: boolean
) => {
  await databases.updateDocument(dbID, resourcesCollectionID, resourceID, {
    favourite: !favourite,
  });
};

export const getFolderContentCount = async (folderID: string) => {
  const user = await account.get();
  const result = await databases.listDocuments(dbID, resourcesCollectionID, [
    Query.equal("parentID", folderID),
    Query.equal("trash", false),
    Query.equal("userID", user.$id),
  ]);
  return result.documents.length;
};

export const getTrash = async () => {
  const user = await account.get();
  const result = await databases.listDocuments(dbID, resourcesCollectionID, [
    Query.equal("trash", true),
    Query.equal("userID", user.$id),
  ]);
  return result.documents as AppwriteDocument[];
};

export const getFavourites = async () => {
  const user = await account.get();
  const result = await databases.listDocuments(dbID, resourcesCollectionID, [
    Query.equal("favourite", true),
    Query.equal("trash", false),
    Query.equal("userID", user.$id),
  ]);
  return result.documents as AppwriteDocument[];
};

export const getFileCategoryCount = async (mimeTypes: string[]) => {
  const user = await account.get();
  const queries: string[] = [];
  mimeTypes.forEach((type) => {
    queries.push(Query.equal("mimeType", type));
  });

  const result = await databases.listDocuments(dbID, resourcesCollectionID, [
    Query.equal("userID", user.$id),
    Query.equal("trash", false),
    Query.or([...queries]),
  ]);

  return result.total;
};

export const getRecentFiles = async () => {
  const user = await account.get();

  const result = await databases.listDocuments(dbID, resourcesCollectionID, [
    Query.orderDesc("$createdAt"),
    Query.equal("trash", false),
    Query.equal("userID", user.$id),
    Query.equal("type", "file"),
    Query.limit(10),
  ]);
  return result.documents as AppwriteDocument[];
};

export const getFolderName = async (folderID: string | undefined) => {
  if (!folderID) return "No name";
  if (folderID == "root") return "Root";
  const result = await databases.getDocument(
    dbID,
    resourcesCollectionID,
    folderID
  );
  return result.name as string;
};

export const getFileCategory = async (categoryKey: string) => {
  if (!categoryKey) return [];

  // @ts-expect-error - mimeType is not properly typed
  if (!mimeType[categoryKey]) return [];

  const user = await account.get();

  const queries: string[] = [];
  // @ts-expect-error - mimeType is not properly typed
  mimeType[categoryKey].forEach((type) => {
    queries.push(Query.equal("mimeType", type));
  });

  const result = await databases.listDocuments(dbID, resourcesCollectionID, [
    Query.equal("userID", user.$id),
    Query.equal("trash", false),
    Query.equal("type", "file"),
    Query.or([...queries]),
  ]);

  return result.documents as AppwriteDocument[];
};

export const search = async (query: string) => {
  const user = await account.get();
  const result = await databases.listDocuments(dbID, resourcesCollectionID, [
    Query.search("name", query),
    Query.equal("userID", user.$id),
  ]);
  return result.documents as AppwriteDocument[];
};

export const rename = async (resourceID: string, name: string) => {
  const result = await databases.updateDocument(
    dbID,
    resourcesCollectionID,
    resourceID,
    {
      name,
    }
  );
  return result.name;
};
