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
      <img
        src={fileURL}
        className="w-full h-full object-contain object-center rounded-2xl"
      />
    );
  else if (getFileExtension(file.name) == "pdf")
    previewContent = <iframe src={fileURL} className="w-full h-full" />;
  else
    previewContent =
      "Now preview available for this file type. Cloud69 is in beta and we are working towards supporting more features";
  useEffect(() => {
    if (isError) console.log(error);
  }, [isError, error]);
  return (
    <ReactModal
      isOpen={isOpen}
      className="absolute inset-4 lg:inset-10 overflow-hidden bg-background p-4 rounded-xl md:rounded-3xl"
      overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black/40"
      shouldCloseOnOverlayClick
      onRequestClose={() => close()}
    >
      <div className="w-full h-full space-y-4 flex flex-col">
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
        <div className="flex-1">
          {isLoading ? <ActivityIndicator /> : previewContent}
        </div>
      </div>
    </ReactModal>
  );
};
export default FilePreview;
