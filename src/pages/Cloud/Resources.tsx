import { getChildren } from "@/firebase/services";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import FolderCard from "./FolderCard";
import { Loader2 } from "lucide-react";
import { FileType, Folder } from "@/types";
import FileList, { FileRow } from "@/components/FileList";
import FolderOptions from "../../components/FolderOptions";
import EmptyFolder from "@/components/EmptyFolder";

const Resources = () => {
  const { id } = useParams();
  const {
    data: resources,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["resources", id],
    queryFn: () => getChildren(id),
  });
  if (isLoading)
    return (
      <div className="w-full h-20 flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (error) return <p>Something went wrong</p>;
  if (resources && resources.length == 0) return <EmptyFolder />;

  const folders = resources?.filter((resource) => resource.type == "folder");
  const files = resources?.filter(
    (resource) => resource.type == "file"
  ) as unknown as FileType[];

  return (
    <div className="px-2 space-y-8">
      <section className="space-y-2">
        <h2 className="font-semibold text-muted-foreground">Folders</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {folders?.map((folder, index) => (
            <FolderCard folder={folder as Folder} key={index} />
          ))}
        </div>
      </section>
      <section className="space-y-2">
        <FileList
          files={files}
          renderItem={(file) => (
            <FileRow file={file}>
              <FileRow.Icon />
              <FileRow.Name />
              <FileRow.Size />
              <FileRow.Actions>
                <FolderOptions resource={file} />
              </FileRow.Actions>
            </FileRow>
          )}
        />
      </section>
    </div>
  );
};

export default Resources;
