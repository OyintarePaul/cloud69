import { clsx, type ClassValue } from "clsx";
import { FieldValue, Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const randomID = () => {
  return Math.random().toString(20).substring(2, 16);
};

export const getFileExtension = (fileName: string) => fileName.split(".").pop();

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < Math.pow(1024, 2)) {
    return `${(bytes / Math.pow(1024, 1)).toFixed(1)}KB`;
  }
};

export const convertTimestamp = (timestamp: Timestamp) => {
  return timestamp.toDate();
};
