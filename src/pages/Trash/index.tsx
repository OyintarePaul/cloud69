import ActivityIndicator from "@/components/ActivityIndicator";
import FileList, { FileRow } from "@/components/FileList";
import { getTrash } from "@/firebase/services";
import { useQuery } from "@tanstack/react-query";
import RestoreFromTrash from "./RestoreFromTrash";
import DeletePermanently from "./DeletePermanently";
import { useEffect } from "react";

const Trash = () => {
  const {
    isLoading,
    data: resources,
    error,
  } = useQuery({
    queryKey: ["trash"],
    queryFn: () => getTrash(),
  });

  useEffect(() => {
    if (error) console.log(error);
    if (resources) console.log(resources);
    if (isLoading) console.log("Is loading");
  }, [resources, error, isLoading]);

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <ActivityIndicator />;
  if (resources)
    return (
      <div className="space-y-2 px-4">
        <h2 className="font-bold text-2xl mt-2">Trash</h2>
        <FileList
          headings={["", "Name", "Actions"]}
          files={resources}
          renderItem={(file) => (
            <FileRow file={file}>
              <FileRow.Icon />
              <FileRow.Name allowPreview={false} />
              <FileRow.Actions>
                <div className="flex gap-4 items-center">
                  <RestoreFromTrash resourceID={file.id} />
                  <DeletePermanently resourceID={file.id} />
                </div>
              </FileRow.Actions>
            </FileRow>
          )}
        />
      </div>
    );
};
export default Trash;
