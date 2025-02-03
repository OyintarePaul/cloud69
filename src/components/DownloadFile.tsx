import { getFileURL } from "@/firebase/services";
import { AppwriteDocument } from "@/types";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import LoadingBtn from "./LoadingBtn";

const DownloadFile = ({ resource }: { resource: AppwriteDocument }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["file", resource.$id, "download-url"],
    queryFn: () => getFileURL(resource.firebase_storage_path as string),
  });

  return (
    <LoadingBtn isLoading={isLoading}>
      <a
        href={data}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1"
      >
        <Download className="size-4" />
        Download
      </a>
    </LoadingBtn>
  );
};
export default DownloadFile;
