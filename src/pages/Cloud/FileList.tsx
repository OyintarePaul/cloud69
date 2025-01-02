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
import { convertTimestamp, formatFileSize } from "@/lib/utils";
import FolderOptions from "../../components/FolderOptions";

import FilePreview from "@/components/FilePreview";
import { useState } from "react";

const FileList = ({ files }: { files: FileType[] }) => {
  return (
    <>
      <h2 className="font-semibold text-muted-foreground">Files</h2>

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="hidden md:block">Uploaded At</TableHead>
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
          <img src={getIconSrc(file.mimeType || "")} className="size-8" />
        </TableCell>
        <TableCell onClick={() => setIsPreviewOpen(true)}>
          {file.name.substring(0, 20)}
        </TableCell>
        <TableCell>{formatFileSize(file.size)}</TableCell>
        <TableCell className="hidden md:block">
          {convertTimestamp(file.createdAt).toDateString()}
        </TableCell>
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
