import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getFileURL } from "@/firebase/services";
import { AppwriteDocument } from "@/types";
import { Download } from "lucide-react";

const DownloadFile = ({
  resource,
  closeDropdown,
}: {
  resource: AppwriteDocument;
  closeDropdown: () => void;
}) => {
  const handleDownload = async () => {
    const url = await getFileURL(resource.firebase_storage_path as string);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.download = resource.name || "";
    anchor.click();
    anchor.type = resource.mimeType || "";
    closeDropdown();
  };
  return (
    <DropdownMenuItem
      className="flex gap-2 items-center"
      onClick={handleDownload}
    >
      <Download className="size-4" />
      Download
    </DropdownMenuItem>
  );
};
export default DownloadFile;
