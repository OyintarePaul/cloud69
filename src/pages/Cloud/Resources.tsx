import { getChildren } from "@/firebase/services";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import FolderCard from "./FolderCard";
import { Loader2 } from "lucide-react";
import { FileType, Folder } from "@/types";

import FileList from "./FileList";

const Resources = () => {
  const { id } = useParams();
  const { data: resources, isLoading } = useQuery({
    queryKey: ["resources", id],
    queryFn: () => getChildren(id),
  });
  if (isLoading)
    return (
      <div className="w-full h-20 flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (resources && resources.length == 0)
    return <div>This folder is empty. Create one now</div>;

  const folders = resources?.filter((resource) => resource.type == "folder");
  const files = resources?.filter(
    (resource) => resource.type == "file"
  ) as unknown as FileType[];

  return (
    <div className="px-2 space-y-8">
      <section className="space-y-2">
        <h2 className="font-semibold text-muted-foreground">Folders</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {folders?.map((folder, index) => (
            <FolderCard folder={folder as Folder} key={index} />
          ))}
        </div>
      </section>
      <section className="space-y-2">
        <FileList files={files} />
      </section>
    </div>
  );
};

export default Resources;
