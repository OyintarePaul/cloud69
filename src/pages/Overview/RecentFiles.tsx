import ActivityIndicator from "@/components/ActivityIndicator";
import { getRecentFiles } from "@/firebase/services";
import { useQuery } from "@tanstack/react-query";
import FolderOptions from "../../components/FolderOptions";
import FileList, { FileRow } from "@/components/FileList";

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
        <FileList
          files={resources}
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
        />{" "}
      </div>
    );
};
export default RecentFiles;
