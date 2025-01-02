import { Timestamp } from "firebase/firestore";

export type Resource = {
  id: string;
  name: string;
  parent: string;
  user: string;
  createdAt: Timestamp;
  trash: boolean;
  trashedAt: Timestamp | null;
};

export type Folder = {
  type: "folder";
} & Resource;

export type FileType = {
  type: "file";
  path: string;
  size: number;
  mimeType: string;
  favourite: boolean;
} & Resource;

export type FileOrFolder = Folder | FileType;
