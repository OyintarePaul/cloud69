import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import MoveToTrash from "./MoveToTrash";
import AddToFavourites from "./AddToFavourites";
import { AppwriteDocument } from "@/types";

const FolderOptions = ({ resource }: { resource: AppwriteDocument }) => {
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
            resourceID={resource.$id}
            closeDropdown={closeDropdown}
            favourite={resource.favourite as boolean}
          />
        )}

        {/* <Rename
          resourceID={resource.$id}
          previousName={resource.name}
          closeDropdown={closeDropdown}
        /> */}
        <MoveToTrash id={resource.$id} closeDropdown={closeDropdown} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default FolderOptions;
