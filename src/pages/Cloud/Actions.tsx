import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import NewFolder from "./NewFolder";

const Actions = () => {
  return (
    <div className="flex gap-2 items-center px-2">
      <NewFolder />
      <Button className="space-x-2">
        <Upload className="size-4" />
        <span>Upload File</span>
      </Button>
    </div>
  );
};
export default Actions;
