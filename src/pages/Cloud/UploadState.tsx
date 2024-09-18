import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUpload } from "@/hooks/useUpload";
import { CircleX, Loader2 } from "lucide-react";
import { useEffect } from "react";

type IProps = {
  file: File;
};
const UploadState = ({ file }: IProps) => {
  const { upload, progress, uploadState } = useUpload(file, {
    onSuccess: (snapshot) => console.log(snapshot),
    onError: (e) => console.log(e),
  });

  useEffect(() => {
    upload();
  }, []);

  useEffect(() => {
    console.log(progress);
    console.log(uploadState);
  }, [progress, uploadState]);

  return (
    <div>
      <div className="flex gap-2 justify-between items-center">
        <p className="line-clamp-1">
          {uploadState == "running" && (
            <span>
              <Loader2 className="size-4 animate-spin mr-2 inline" />
            </span>
          )}
          {file.name}
        </p>
        <span>
          <Button size="icon" variant="ghost">
            <CircleX className="text-destructive size-4" />
          </Button>
        </span>
      </div>
      <Progress value={progress * 100} className="w-full h-1" />
    </div>
  );
};
export default UploadState;
