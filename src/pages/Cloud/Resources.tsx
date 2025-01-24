import { getChildren } from "@/appwrite/services";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import FolderCard from "./FolderCard";

import FileList, { FileRow } from "@/components/FileList";
import FolderOptions from "../../components/FolderOptions";

import PageLoader from "@/components/PageLoader";
import PageError from "@/components/PageError";
import EmptyFolder from "@/components/EmptyFolder";

const Resources = () => {
  const { id: parentID } = useParams();
  const {
    data: resources,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["resources", parentID],
    queryFn: () => getChildren(parentID),
  });
  if (isLoading) return <PageLoader />;
  if (error) return <PageError />;
  if (resources && resources.length == 0) return <EmptyFolder />;

  const folders =
    resources?.filter((resource) => resource.type == "folder") || [];
  const files = resources?.filter((resource) => resource.type == "file") || [];

  return (
    <div className="px-2 space-y-8">
      {folders.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-semibold text-muted-foreground">Folders</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folders?.map((folder, index) => (
              <FolderCard folder={folder} key={index} />
            ))}
          </div>
        </section>
      )}

      {files.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-semibold text-muted-foreground">Files</h2>
          <FileList
            files={files}
            renderItem={(file, index) => (
              <FileRow file={file} key={index}>
                <FileRow.Icon />
                <FileRow.Name />
                <FileRow.Size />
                <FileRow.CreatedAt />
                <FileRow.Actions>
                  <FolderOptions resource={file} />
                </FileRow.Actions>
              </FileRow>
            )}
          />
        </section>
      )}
    </div>
  );
};

export default Resources;
