import { FieldValue } from "firebase/firestore";

export type Resource = {
  name: string;
  parent: string;
  user: string;
  createdAt: FieldValue;
};

export type Folder = {
  type: "folder";
} & Resource;

export type File = {
  type: "file";
  path: string;
  size: number;
  mimeType: string;
} & Resource;
