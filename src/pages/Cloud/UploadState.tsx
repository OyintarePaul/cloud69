import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUpload } from "@/hooks/useUpload";
import { CircleCheck, CircleX, Loader2 } from "lucide-react";
import { useEffect } from "react";

type IProps = {
  file: File;
  onSuccess?: () => void;
};
const UploadState = ({ file, onSuccess }: IProps) => {
  const { upload, progress, uploadState } = useUpload(file, {
    onError: (e) => console.log(e),
    onSuccess: () => {
      if (onSuccess) onSuccess();
    },
  });

  useEffect(() => {
    upload();
  }, []);

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
            {uploadState == "success" ? (
              <CircleCheck className="size-4 text-primary" />
            ) : (
              <CircleX className="size-4 text-destructive" />
            )}
          </Button>
        </span>
      </div>
      {uploadState !== "success" && (
        <Progress value={progress * 100} className="w-full h-1" />
      )}
    </div>
  );
};
export default UploadState;
