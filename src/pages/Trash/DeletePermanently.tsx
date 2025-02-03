import ActivityIndicator from "@/components/ActivityIndicator";
import { Button } from "@/components/ui/button";
import { deletePermanently } from "@/appwrite/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

const DeletePermanently = ({
  resourceID,
  path,
  type,
}: {
  resourceID: string;
  path: string;
  type: string;
}) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, mutate } = useMutation({
    mutationFn: () => deletePermanently(resourceID, path, type),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trash"],
      });
      setIsOpen(false);
    },
  });
  const handleDelete = () => {
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
            <DialogTitle>Delete Permanently</DialogTitle>
            <DialogDescription>
              Are you sure? This can't be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              variant="destructive"
            >
              {isPending ? <ActivityIndicator /> : "Yes"}
            </Button>
            <Button onClick={handleModalClose} variant="outline">
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button
        size="icon"
        variant="ghost"
        className="text-destructive"
        disabled={isPending}
        onClick={() => setIsOpen(true)}
      >
        <Trash className="size-4" />
      </Button>
    </>
  );
};
export default DeletePermanently;
