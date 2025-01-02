import { FileOrFolder, FileType } from "@/types";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "./ui/table";
import { getIconSrc } from "@/lib/resource-icons";
import { cn, convertTimestamp, formatFileSize } from "@/lib/utils";
import { createContext, useContext, useState } from "react";
import FilePreview from "./FilePreview";

const fileContext = createContext({} as FileType);

const FileList = ({
  files,

  renderItem,
  headings,
}: {
  files: FileOrFolder[];

  renderItem: (item: FileOrFolder) => React.ReactNode;
  headings: string[];
}) => {
  return (
    <>
      <Table className="w-full">
        <TableHeader>
          {headings.map((heading: string, index: number) => (
            <TableHead key={index}>{heading}</TableHead>
          ))}
        </TableHeader>
        <TableBody>{files?.map((item) => renderItem(item))}</TableBody>
      </Table>
    </>
  );
};
export default FileList;

export const FileRow = ({
  file,
  children,
}: {
  file: FileType;
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
  return <TableCell>{formatFileSize(file.size)}</TableCell>;
};

const Name = ({ allowPreview = true }: { allowPreview?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const file = useContext(fileContext);
  return (
    <>
      <TableCell
        onClick={() => setIsOpen(true)}
        className={cn({ "cursor-pointer": allowPreview })}
      >
        {file.name.substring(0, 20)}
      </TableCell>
      {allowPreview && (
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
    <TableCell className="hidden md:block">
      {convertTimestamp(file.createdAt).toDateString()}
    </TableCell>
  );
};

const Icon = () => {
  const file = useContext(fileContext);
  return (
    <TableCell className="w-10">
      <img
        src={getIconSrc(file.mimeType || "")}
        className="w-full object-cover"
      />
    </TableCell>
  );
};

const Actions = ({ children }: { children: React.ReactNode }) => {
  return <TableCell>{children}</TableCell>;
};

FileRow.Size = Size;
FileRow.Name = Name;
FileRow.CreatedAt = CreatedAt;
FileRow.Icon = Icon;
FileRow.Actions = Actions;
