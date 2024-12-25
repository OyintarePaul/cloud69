import ReactModal from "react-modal";
import { FileType } from "@/types";
import { Button } from "./ui/button";
import ActivityIndicator from "./ActivityIndicator";
import { useQuery } from "@tanstack/react-query";
import { getFileURL } from "@/firebase/services";
import { getFileExtension } from "@/lib/utils";
import { useEffect } from "react";
import { X } from "lucide-react";

const FilePreview = ({
  isOpen,
  close,
  file,
}: {
  file: FileType;
  isOpen: boolean;
  close: () => void;
}) => {
  const {
    data: fileURL,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["file", file.id, "download-url"],
    queryFn: () => getFileURL(file.path),
  });

  let previewContent;
  if (["jpg", "png", "jpeg"].includes(getFileExtension(file.name) || ""))
    previewContent = (
      <img src={fileURL} className="w-full h-full object-contain" />
    );
  if (getFileExtension(file.name) == "pdf")
    previewContent = <iframe src={fileURL} className="w-full h-full" />;

  useEffect(() => {
    if (isError) console.log(error);
  }, [isError, error]);
  return (
    <ReactModal isOpen={isOpen}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <div className="w-full h-full space-y-4">
          <div className="flex justify-between items-center">
            <p className="font-bold">{file.name}</p>
            <Button
              size="icon"
              variant="ghost"
              onClick={close}
              className="text-destructive"
            >
              <X className="size-4" />
            </Button>
          </div>
          {previewContent}
        </div>
      )}
    </ReactModal>
  );
};
export default FilePreview;
