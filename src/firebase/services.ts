import { storage } from "./init";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { randomID } from "@/lib/utils";

export const uploadFile = (file: File) => {
  const path = `files/${randomID()}`;
  const storageRef = ref(storage, path);
  return uploadBytesResumable(storageRef, file);
};

export const getFileURL = async (path: string) => {
  const storageRef = ref(storage, path);
  const url = await getDownloadURL(storageRef);
  console.log(url);
  return url;
};
