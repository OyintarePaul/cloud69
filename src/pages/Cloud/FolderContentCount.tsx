import { getFolderContentCount } from "@/appwrite/services";
import { useQuery } from "@tanstack/react-query";

const FolderContentCount = ({ folderID }: { folderID: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["content-count", folderID],
    queryFn: () => getFolderContentCount(folderID),
  });
  return <p>{isLoading ? "Calculating..." : `${data} file(s)`}</p>;
};
export default FolderContentCount;
