import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import MoveToTrash from "./MoveToTrash";

const FolderOptions = ({ id }: { id: string }) => {
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
        <DropdownMenuItem>Properties</DropdownMenuItem>
        <DropdownMenuItem>
          <MoveToTrash id={id} closeDropdown={closeDropdown} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default FolderOptions;
