import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveToTrash } from "@/firebase/services";
import { useParams } from "react-router";

const MoveToTrash = ({
  id,
  closeDropdown,
}: {
  id: string;
  closeDropdown: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { id: parentID } = useParams();
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: () => {
      return moveToTrash(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resources", parentID],
      });
      setIsOpen(false);
      closeDropdown();
    },
  });
  const handleMoveToTrash = () => {
    mutate();
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Move to trash</DialogTitle>
            <DialogDescription>Move this item to trash.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleMoveToTrash();
              }}
              variant="destructive"
            >
              {isPending ? <Loader2 className="animate-spin size-4" /> : "Yes"}
            </Button>
            <Button onClick={handleModalClose} variant="outline">
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <span
        className="flex gap-2 items-center text-red-600"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <Trash2 className="size-4" />
        Move to trash
      </span>
    </>
  );
};
export default MoveToTrash;
