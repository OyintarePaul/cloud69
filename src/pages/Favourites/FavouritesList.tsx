import { FileType, Folder } from "@/types";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { getIconSrc } from "@/lib/resource-icons";
import FolderOptions from "../Cloud/FolderOptions";

const FavouritesList = ({
  resources,
}: {
  resources: FileType[] | Folder[];
}) => {
  if (resources.length == 0) return <p>Your favourite list is empty. </p>;
  return (
    <div className="space-y-4 px-4">
      <h2 className="font-bold text-2xl mt-4">Favourites</h2>
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
                <img
                  src={getIconSrc(resource.mimeType || "")}
                  className="size-8"
                />
              </TableCell>
              <TableCell>{resource.name}</TableCell>
              <TableCell>
                <div className="flex gap-4 items-center">
                  <FolderOptions resource={resource} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default FavouritesList;
