import FileList, { FileRow } from "@/components/FileList";
import { getTrash } from "@/appwrite/services";
import { useQuery } from "@tanstack/react-query";
import RestoreFromTrash from "./RestoreFromTrash";
import DeletePermanently from "./DeletePermanently";
import PageLoader from "@/components/PageLoader";
import EmptyTrash from "@/components/EmptyTrash";

const Trash = () => {
  const {
    isLoading,
    data: resources,
    error,
  } = useQuery({
    queryKey: ["trash"],
    queryFn: () => getTrash(),
  });

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <PageLoader />;
  if (resources && resources.length == 0) return <EmptyTrash />;

  if (resources)
    return (
      <div className="space-y-2 px-4">
        <h2 className="font-bold text-2xl mt-2">Trash</h2>
        <FileList
          files={resources}
          renderItem={(file) => (
            <FileRow file={file}>
              <FileRow.Icon />
              <FileRow.Name />
              <FileRow.Size />
              <FileRow.Actions>
                <div className="flex gap-4 items-center">
                  <RestoreFromTrash resourceID={file.$id} />
                  <DeletePermanently
                    resourceID={file.$id}
                    path={file.firebase_storage_path || ""}
                    type={file.type}
                  />
                </div>
              </FileRow.Actions>
            </FileRow>
          )}
        />
      </div>
    );
};
export default Trash;
