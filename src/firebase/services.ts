import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  getCountFromServer,
  deleteDoc,
  or,
  QueryFieldFilterConstraint,
  and,
  orderBy,
  limit,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, db, storage } from "./init";

import { FileOrFolder, FileType, Folder } from "@/types";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { randomID } from "@/lib/utils";

export const createFolder = async (name: string, parent: string) => {
  const payload: Omit<Folder, "id"> = {
    name,
    user: auth.currentUser?.uid as string,
    parent,
    type: "folder",
    createdAt: serverTimestamp() as Timestamp,
    trash: false,
    trashedAt: null,
  };
  const snapshot = await addDoc(collection(db, "resources"), payload);
  return snapshot;
};

export const uploadFile = (file: File) => {
  const path = `files/${randomID()}`;
  const storageRef = ref(storage, path);
  return uploadBytesResumable(storageRef, file);
};

export const createFile = async (payload: Omit<FileType, "id">) => {
  const snapshot = await addDoc(collection(db, "resources"), payload);
  return snapshot;
};

export const getChildren = async (parentID?: string) => {
  // gets all resources whose parent ID matches the parentID passed or whose parentID is null
  const snapshot = await getDocs(
    query(
      collection(db, "resources"),
      where("parent", "==", parentID),
      where("user", "==", auth.currentUser?.uid),
      where("trash", "==", false)
    )
  );
  const resources: FileOrFolder[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      type: data.type,
      parent: data.parent,
      user: data.user,
      createdAt: data.createdAt,
      mimeType: data.mimeType,
      size: data.size,
      path: data.path,
      favourite: data.favourite,
      trash: data.trash,
      trashedAt: data.trashedAt,
    };
  });
  return resources;
};

export const moveToTrash = async (resourceID: string) => {
  const docRef = doc(db, "resources", resourceID);
  await updateDoc(docRef, {
    trash: true,
    trashedAt: serverTimestamp(),
  });
  return;
};

export const restoreFromTrash = async (resourceID: string) => {
  const docRef = doc(db, "resources", resourceID);
  await updateDoc(docRef, {
    trash: false,
    trashedAt: null,
  });
  return;
};

export const deletePermanently = async (resourceID: string) => {
  const docRef = doc(db, "resources", resourceID);
  await deleteDoc(docRef);
  return;
};

export const toggleFavourites = async (
  resourceID: string,
  favourite: boolean
) => {
  const docRef = doc(db, "resources", resourceID);
  await updateDoc(docRef, {
    favourite,
  });
  return;
};

export const getFolderContentCount = async (folderID: string) => {
  const snapshot = await getCountFromServer(
    query(
      collection(db, "resources"),
      where("parent", "==", folderID),
      where("user", "==", auth.currentUser?.uid),
      where("trash", "==", false)
    )
  );
  return snapshot.data().count;
};

export const getFileURL = async (path: string) => {
  const storageRef = ref(storage, path);
  const url = await getDownloadURL(storageRef);
  console.log(url);
  return url;
};

export const getTrash = async () => {
  const snapshot = await getDocs(
    query(
      collection(db, "resources"),
      where("user", "==", auth.currentUser?.uid),
      where("trash", "==", true)
    )
  );
  const resources: FileType[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      type: data.type,
      parent: data.parent,
      user: data.user,
      createdAt: data.createdAt,
      mimeType: data.mimeType,
      size: data.size,
      path: data.path,
      trash: data.trash,
      trashedAt: data.trashedAt,
      favourite: data.favourite,
    };
  });
  return resources;
};

export const getFavourites = async () => {
  const snapshot = await getDocs(
    query(
      collection(db, "resources"),
      where("user", "==", auth.currentUser?.uid),
      where("favourite", "==", true),
      where("trash", "==", false)
    )
  );
  const resources: FileType[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      type: data.type,
      parent: data.parent,
      user: data.user,
      createdAt: data.createdAt,
      mimeType: data.mimeType,
      size: data.size,
      path: data.path,
      favourite: data.favourite,
      trash: data.trash,
      trashedAt: data.trashedAt,
    };
  });
  return resources;
};

export const getFileCategoryCount = async (category: string[]) => {
  const filters: QueryFieldFilterConstraint[] = [];
  category.forEach((cat) => {
    filters.push(where("mimeType", "==", cat));
  });
  const q = query(
    collection(db, "resources"),
    and(
      where("user", "==", auth.currentUser?.uid),
      where("trash", "==", false),
      or(...filters)
    )
  );
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};

export const getRecentFiles = async () => {
  const snapshot = await getDocs(
    query(
      collection(db, "resources"),
      where("user", "==", auth.currentUser?.uid),
      where("type", "==", "file"),
      orderBy("createdAt", "desc"),
      limit(5)
    )
  );

  const resources: FileType[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      type: data.type,
      parent: data.parent,
      user: data.user,
      createdAt: data.createdAt,
      mimeType: data.mimeType,
      size: data.size,
      path: data.path,
      favourite: data.favourite,
      trash: data.trash,
      trashedAt: data.trashedAt,
    };
  });
  return resources;
};

export const getFolderName = async (folderID: string | undefined) => {
  if (!folderID) return "No name";
  if (folderID == "root") return "Root";
  const snapshot = await getDoc(doc(db, "resources", folderID));
  return snapshot.data()?.name;
};
