import { getFavourites } from "@/appwrite/services";
import { useQuery } from "@tanstack/react-query";
import FileList, { FileRow } from "@/components/FileList";
import FolderOptions from "../../components/FolderOptions";
import PageLoader from "@/components/PageLoader";

import EmptyFavourites from "@/components/EmptyFavourites";

const Favourites = () => {
  const {
    isLoading,
    data: resources,
    error,
  } = useQuery({
    queryKey: ["favourites"],
    queryFn: () => getFavourites(),
  });
  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <PageLoader />;
  if (resources && resources.length == 0) return <EmptyFavourites />;
  if (resources)
    return (
      <div className="space-y-2 px-4">
        <h2 className="font-bold text-2xl mt-2">Favourites</h2>
        <FileList
          files={resources}
          renderItem={(file) => (
            <FileRow file={file}>
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
      </div>
    );
};
export default Favourites;
