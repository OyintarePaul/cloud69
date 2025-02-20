import FileList, { FileRow } from "@/components/FileList";
import { getFileCategory } from "@/appwrite/services";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import FolderOptions from "@/components/FolderOptions";
import PageLoader from "@/components/PageLoader";
import EmptyCategory from "@/components/EmptyCategory";

const Category = () => {
  const { categoryName } = useParams();
  const {
    data: resources,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["category", categoryName],
    queryFn: () => getFileCategory(categoryName as string),
  });
  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <PageLoader />;
  if (resources && resources.length == 0) return <EmptyCategory />;
  if (resources)
    return (
      <div className="space-y-2 px-4">
        <h2 className="font-bold text-2xl mt-2 capitalize">
          {categoryName + "s"}
        </h2>
        <FileList
          files={resources}
          renderItem={(file) => (
            <FileRow file={file}>
              <FileRow.Icon />
              <FileRow.Name />
              <FileRow.Size />
              <FileRow.Actions>
                <div className="flex gap-4 items-center">
                  <FolderOptions resource={file} />
                </div>
              </FileRow.Actions>
            </FileRow>
          )}
        />
      </div>
    );
};
export default Category;
