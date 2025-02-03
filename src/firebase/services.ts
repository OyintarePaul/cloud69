import { storage } from "./init";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadMetadata,
} from "firebase/storage";
import { randomID } from "@/lib/utils";

export const uploadFile = (file: File) => {
  const metadata: UploadMetadata = {
    contentType: file.type,
  };
  const path = `files/${randomID()}`;
  const storageRef = ref(storage, path);
  return uploadBytesResumable(storageRef, file, metadata);
};

export const getFileURL = async (path: string) => {
  const storageRef = ref(storage, path);
  const url = await getDownloadURL(storageRef);
  return url;
};

export const deleteFile = async (path: string) => {
  const fileRef = ref(storage, path);
  await deleteObject(fileRef);
};
