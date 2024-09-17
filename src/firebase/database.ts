import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "./init";

import { Folder } from "@/types";

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
  console.log(file);
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
