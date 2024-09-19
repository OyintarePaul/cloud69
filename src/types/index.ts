import { FieldValue } from "firebase/firestore";

export type Resource = {
  id?: string;
  name: string;
  parent: string;
  user: string;
  createdAt: FieldValue;
};

export type Folder = {
  type: "folder";
} & Resource;

export type FileType = {
  type: "file";
  path: string;
  size: number;
  mimeType: string;
} & Resource;
