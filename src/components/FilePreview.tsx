import ReactModal from "react-modal";
import { AppwriteDocument } from "@/types";
import { Button } from "./ui/button";
import ActivityIndicator from "./ActivityIndicator";
import { useQuery } from "@tanstack/react-query";
import { getFileURL } from "@/firebase/services";
import { X } from "lucide-react";
import DownloadFile from "./DownloadFile";
import { image, pdf } from "@/lib/mime-types";

const FilePreview = ({
  isOpen,
  close,
  file,
}: {
  file: AppwriteDocument;
  isOpen: boolean;
  close: () => void;
}) => {
  const { data: fileURL, isLoading } = useQuery({
    queryKey: ["file", file.$id, "download-url"],
    queryFn: () => getFileURL(file.firebase_storage_path || ""),
  });

  return (
    <ReactModal
      isOpen={isOpen}
      className="absolute inset-2 lg:inset-4 overflow-hidden bg-background p-4 rounded-xl md:rounded-3xl"
      overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-black/40"
      shouldCloseOnOverlayClick
      onRequestClose={() => close()}
    >
      <div className="w-full h-full flex flex-col gap-2">
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
          {isLoading ? <ActivityIndicator /> : previewContent(file, fileURL)}
        </div>
      </div>
    </ReactModal>
  );
};
export default FilePreview;

const previewContent = (file: AppwriteDocument, url: string | undefined) => {
  const previewMap = new Map([
    [
      image,
      <img
        src={url}
        className="w-full h-full object-contain object-center rounded-2xl"
      />,
    ],
    [pdf, <iframe src={url} className="w-full h-full" />],
  ]);

  for (const [key, value] of previewMap) {
    if (key.includes(file.mimeType || "")) return value;
  }
  return <DownloadFile resource={file} />;
};
