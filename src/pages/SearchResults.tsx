import { search } from "@/appwrite/services";
import EmptySearch from "@/components/EmptySearch";
import FileList, { FileRow } from "@/components/FileList";
import FolderOptions from "@/components/FolderOptions";
import PageLoader from "@/components/PageLoader";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const {
    isLoading,
    data: resources,
    error,
  } = useQuery({
    queryKey: ["search", query],
    queryFn: () => search(query),
  });
  if (error) return <div>Error: {error.message}</div>;
  if (isLoading) return <PageLoader />;
  if (resources && resources.length == 0) return <EmptySearch />;

  if (resources) {
    return (
      <div className="space-y-2 px-4">
        <h2 className="font-bold text-2xl mt-2">{`${resources?.length} results found`}</h2>
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
  }
};

export default SearchResults;
