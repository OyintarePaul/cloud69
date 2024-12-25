import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { FileType, Folder } from "@/types";
import { getFileExtension } from "./../../lib/utils";
import { getIconSrc } from "@/lib/resource-icons";
import { FolderClosed } from "lucide-react";
import DeletePermanently from "./DeletePermanently";
import RestoreFromTrash from "./RestoreFromTrash";

const TrashList = ({ resources }: { resources: FileType[] | Folder[] }) => {
  return (
    <div className="space-y-4 px-4">
      <h2 className="font-bold text-2xl mt-4">Trash</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resources.map((resource) => (
            <TableRow key={resource.id}>
              <TableCell>
                {resource.type == "file" ? (
                  <img
                    src={getIconSrc(getFileExtension(resource.name) || "")}
                    className="size-8"
                  />
                ) : (
                  <FolderClosed className="size-8" />
                )}
              </TableCell>
              <TableCell>{resource.name}</TableCell>
              <TableCell>
                <div className="flex gap-4 items-center">
                  <RestoreFromTrash resourceID={resource.id} />
                  <DeletePermanently resourceID={resource.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default TrashList;
