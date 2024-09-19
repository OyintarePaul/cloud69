import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "./init";

import { FileType, Folder } from "@/types";
import { ref, uploadBytesResumable } from "firebase/storage";
import { randomID } from "@/lib/utils";

export const createFolder = async (name: string, parent: string) => {
  const payload: Folder = {
    name,
    user: auth.currentUser?.uid as string,
    parent,
    type: "folder",
    createdAt: serverTimestamp(),
  };
  const snapshot = await addDoc(collection(db, "resources"), payload);
  return snapshot;
};

export const uploadFile = (file: File) => {
  const path = `files/${randomID()}`;
  const storageRef = ref(storage, path);
  return uploadBytesResumable(storageRef, file);
};

export const createFile = async (payload: FileType) => {
  const snapshot = await addDoc(collection(db, "resources"), payload);
  return snapshot;
};

export const getChildren = async (parentID?: string) => {
  // gets all resources whose parent ID matches the parentID passed or whose parentID is null
  const snapshot = await getDocs(
    query(
      collection(db, "resources"),
      where("parent", "==", parentID),
      where("user", "==", auth.currentUser?.uid)
    )
  );
  const resources: File[] | Folder[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      type: data.type,
      parent: data.parent,
      user: data.user,
      createdAt: data.createdAt,
    };
  });
  return resources;
};
