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
          </TableRow>
        </TableHeader>
        <TableBody>
          {files?.map((file) => (
            <TableRow key={file.id}>
              <TableCell>
                <img
                  src={getIconSrc(getFileExtension(file.name!))}
                  className="size-8"
                />
              </TableCell>
              <TableCell>{file.name}</TableCell>
              <TableCell>{formatFileSize(file.size)}</TableCell>
              <TableCell>
                {convertTimestamp(file.createdAt).toDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
export default FileList;
