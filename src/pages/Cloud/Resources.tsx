import { getChildren } from "@/firebase/database";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Folder from "./Folder";
const Resources = () => {
  const { id } = useParams();
  const { data: resources } = useQuery({
    queryKey: ["resources", id],
    queryFn: () => getChildren(id),
  });
  if (resources && resources.length == 0)
    return <div>This folder is empty. Create one now</div>;

  const folders = resources?.filter((resource) => resource.type == "folder");
  const files = resources?.filter((resource) => resource.type == "file");

  return (
    <div className="px-2 space-y-4">
      <h2 className="font-semibold text-muted-foreground">Folders</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {folders?.map((folder) => (
          <Folder folder={folder} />
        ))}
      </div>
      <div>{/* files */}</div>
    </div>
  );
};

export default Resources;
