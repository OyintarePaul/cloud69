import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import UploadState from "./UploadState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const UploadFiles = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [completedUploads, setCompletedUploads] = useState(0);
  const queryClient = useQueryClient();
  const { id } = useParams();

  useEffect(() => {
    if (completedUploads > 0 && completedUploads == files.length) {
      queryClient.invalidateQueries({ queryKey: ["resources", id] });
      handleModalClose();
    }
  }, [completedUploads, files, queryClient, id]);

  const handleModalClose = () => {
    setIsOpen(false);
    setFiles([]);
  };

  return (
    <>
      <Button className="space-x-2" onClick={() => setIsOpen(true)}>
        <Upload className="size-4" />
        <span>Upload File</span>
      </Button>
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>UPLOAD FILES</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 h-60">
            <div className="flex-1 flex flex-col justify-center items-center gap-4 border-2 border-dashed">
              <Upload className="text-primary size-8" />
              <p>Drag and Drop files</p>
              <span>or</span>
              <div className="w-3/4">
                <Label
                  htmlFor="files"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "cursor-pointer w-full"
                  )}
                >
                  Browse
                </Label>
                <Input
                  id="files"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={(e) => {
                    setFiles(e.target.files ? Array.from(e.target.files) : []);
                  }}
                />
              </div>
            </div>
            <div className="flex-1">
              {files.length == 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-center">
                    Select files to <br />
                    start uploading
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <UploadState
                        file={file}
                        key={index}
                        onSuccess={() =>
                          setCompletedUploads((prev) => prev + 1)
                        }
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadFiles;
