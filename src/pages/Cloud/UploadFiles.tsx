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
import { useState } from "react";
import UploadState from "./UploadState";
import { ScrollArea } from "@/components/ui/scroll-area";

const UploadFiles = () => {
  const [files, setFiles] = useState<File[]>();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button className="space-x-2" onClick={() => setIsOpen(true)}>
        <Upload className="size-4" />
        <span>Upload File</span>
      </Button>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          setFiles([]);
        }}
      >
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
                    setFiles([...e.target.files]);
                  }}
                />
              </div>
            </div>
            <div className="flex-1">
              {files == null || files.length == 0 ? (
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
                      <UploadState file={file} key={index} />
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
