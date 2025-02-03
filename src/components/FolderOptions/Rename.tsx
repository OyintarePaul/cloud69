import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderPen } from "lucide-react";
import { useParams } from "react-router";

import { rename } from "@/appwrite/services";
import LoadingBtn from "../LoadingBtn";
import { useState } from "react";

const Rename = ({
  resourceID,
  previousName,
  closeDropdown,
}: {
  resourceID: string;
  previousName: string;
  closeDropdown: () => void;
}) => {
  const [name, setName] = useState(previousName);
  const [isOpen, setIsOpen] = useState(false);
  const { id: parentID } = useParams();
  const queryClient = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationFn: () => {
      return rename(resourceID, previousName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resources", parentID],
      });
      queryClient.invalidateQueries({
        queryKey: ["recent"],
      });
      queryClient.invalidateQueries({
        queryKey: ["favourites"],
      });

      closeDropdown();
    },
  });
  const handleModalClose = () => {
    setIsOpen(false);
    setName(data);
  };

  const handleClick = () => {
    mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogTrigger asChild>
        <span
          className="flex gap-2 items-center ml-2"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          <FolderPen className="size-4" /> Rename
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename this item</DialogTitle>
          <DialogDescription>Enter a new name and click OK</DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="name">New name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          <LoadingBtn onClick={handleClick} isLoading={isPending}>
            OK
          </LoadingBtn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default Rename;
