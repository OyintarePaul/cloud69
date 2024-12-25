import { FileType } from "@/types";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { getIconSrc } from "@/lib/resource-icons";
import {
  convertTimestamp,
  formatFileSize,
  getFileExtension,
} from "@/lib/utils";
import FolderOptions from "./FolderOptions";
import { Button } from "@/components/ui/button";
import FilePreview from "@/components/FilePreview";
import { useState } from "react";

const FileList = ({ files }: { files: FileType[] }) => {
  return (
    <>
      <h2 className="font-semibold text-muted-foreground">Files</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded At</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files?.map((file) => (
            <FileRow file={file} key={file.id} />
          ))}
        </TableBody>
      </Table>
    </>
  );
};
export default FileList;

const FileRow = ({ file }: { file: FileType }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  return (
    <>
      <TableRow key={file.id}>
        <TableCell>
          <img
            src={getIconSrc(getFileExtension(file.name) || "")}
            className="size-8"
          />
        </TableCell>
        <TableCell onClick={() => setIsPreviewOpen(true)}>
          {file.name}
        </TableCell>
        <TableCell>{formatFileSize(file.size)}</TableCell>
        <TableCell>{convertTimestamp(file.createdAt).toDateString()}</TableCell>
        <TableCell>
          <FolderOptions resource={file} />
        </TableCell>
      </TableRow>
      {isPreviewOpen && (
        <FilePreview
          isOpen={isPreviewOpen}
          file={file}
          close={() => setIsPreviewOpen(false)}
        />
      )}
    </>
  );
};
