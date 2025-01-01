import ActivityIndicator from "@/components/ActivityIndicator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRecentFiles } from "@/firebase/services";
import { getIconSrc } from "@/lib/resource-icons";
import { getFileExtension } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import FolderOptions from "../Cloud/FolderOptions";

const RecentFiles = () => {
  const {
    isLoading,
    data: resources,
    error,
  } = useQuery({
    queryKey: ["recent"],
    queryFn: () => getRecentFiles(),
  });
  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <ActivityIndicator />;
  if (resources?.length == 0) return <p>Your favourite list is empty. </p>;
  if (resources)
    return (
      <div className="space-y-4 px-4">
        <h2 className="font-bold text-2xl mt-4">Recent Files</h2>
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
export default RecentFiles;
