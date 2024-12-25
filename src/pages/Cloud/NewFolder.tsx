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
import { createFolder } from "@/firebase/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useParams } from "react-router";

const NewFolder = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [name, setName] = useState("New Folder");
  const [isOpen, setIsOpen] = useState(false);

  const { isPending, mutate: create } = useMutation({
    mutationFn: () => createFolder(name, id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources", id] });
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
