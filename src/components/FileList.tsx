import { AppwriteDocument } from "@/types";

import { getIconSrc } from "@/lib/resource-icons";
import { cn, formatFileSize } from "@/lib/utils";
import { createContext, useContext, useState } from "react";
import FilePreview from "./FilePreview";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const fileContext = createContext({} as AppwriteDocument);

const FileList = ({
  files,
  renderItem,
}: {
  files: AppwriteDocument[];
  renderItem: (item: AppwriteDocument, index: number) => React.ReactNode;
}) => {
  return (
    <Table className="table-fixed w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-8 md:w-10"></TableHead>
          <TableHead className="w-[60%]">Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead className="hidden md:table-cell">Created At</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files?.map((item, index) => renderItem(item, index))}
      </TableBody>
    </Table>
  );
};
export default FileList;

export const FileRow = ({
  file,
  children,
}: {
  file: AppwriteDocument;
  children: React.ReactNode;
}) => {
  return (
    <fileContext.Provider value={file}>
      <TableRow key={file.id}>{children}</TableRow>
    </fileContext.Provider>
  );
};

const Size = () => {
  const file = useContext(fileContext);
  return <TableCell>{formatFileSize(file.size || 0)}</TableCell>;
};

const Name = () => {
  const [isOpen, setIsOpen] = useState(false);
  const file = useContext(fileContext);
  return (
    <>
      <TableCell
        onClick={() => setIsOpen(true)}
        className={cn({ "cursor-pointer": !file.trash })}
      >
        {file.name}
      </TableCell>
      {!file.trash && (
        <FilePreview
          file={file}
          isOpen={isOpen}
          close={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

const CreatedAt = () => {
  const file = useContext(fileContext);
  return (
    <TableCell className="hidden md:table-cell">
      {file.$createdAt && new Date(file.$createdAt).toDateString()}
    </TableCell>
  );
};

const Icon = () => {
  const file = useContext(fileContext);
  return (
    <TableCell>
      <img
        src={getIconSrc(file.mimeType || "")}
        className="w-full object-contain"
      />
    </TableCell>
  );
};

const Actions = ({ children }: { children: React.ReactNode }) => {
  return <TableCell className="text-center">{children}</TableCell>;
};

FileRow.Size = Size;
FileRow.Name = Name;
FileRow.CreatedAt = CreatedAt;
FileRow.Icon = Icon;
FileRow.Actions = Actions;
