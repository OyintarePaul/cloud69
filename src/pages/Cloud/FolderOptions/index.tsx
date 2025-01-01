import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import MoveToTrash from "./MoveToTrash";
import AddToFavourites from "./AddToFavourites";
import { FileType, Folder } from "@/types";
import DownloadFile from "./DownloadFile";

const FolderOptions = ({ resource }: { resource: FileType | Folder }) => {
  const [open, setOpen] = useState(false);
  const closeDropdown = () => {
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={(open: boolean) => setOpen(open)}>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {resource.type == "file" && (
          <AddToFavourites
            resourceID={resource.id}
            closeDropdown={closeDropdown}
            favourite={resource.favourite}
          />
        )}
        {resource.type == "file" && (
          <DownloadFile resource={resource} closeDropdown={closeDropdown} />
        )}

        <DropdownMenuItem>
          <MoveToTrash id={resource.id} closeDropdown={closeDropdown} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default FolderOptions;
