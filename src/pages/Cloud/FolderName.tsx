import { getFolderName } from "@/appwrite/services";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

const FolderName = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["foldername", id],
    queryFn: () => getFolderName(id),
  });
  return (
    <div className={cn({ "font-bold text-xl capitalize": data })}>
      {isLoading ? "Loading..." : data}
    </div>
  );
};
export default FolderName;
