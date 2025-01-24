import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createResource } from "@/appwrite/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useParams } from "react-router";
import { useAuth } from "@/providers/auth";

const NewFolder = () => {
  const { id: parentID } = useParams() as { id: string };
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState("New Folder");
  const [isOpen, setIsOpen] = useState(false);

  const { isPending, mutate: create } = useMutation({
    mutationFn: () =>
      createResource({
        name,
        type: "folder",
        parentID,
        userID: user?.$id as string,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources", parentID] });
      handleModalClose();
    },
  });

  const handleModalClose = () => {
    setIsOpen(false);
    setName("New Folder");
  };

  const handleClick = (e: FormEvent) => {
    e.preventDefault();
    create();
  };
  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        New Folder
      </Button>
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
            <DialogDescription>Enter the name of your folder</DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="name">Folder name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleClick}>
              {isPending ? <Loader2 className="animate-spin size-4" /> : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewFolder;
