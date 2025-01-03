import { Card, CardHeader } from "@/components/ui/card";
import { getIconSrc } from "@/lib/resource-icons";
import { FileType } from "@/types";

type IProps = {
  file: FileType;
};

const FileCard = ({ file }: IProps) => {
  return (
    <Card>
      <CardHeader>
        <p className="font-semibold line-clamp-1">{file.name}</p>
        <p className="text-muted-foreground">{file.size}</p>
        <img
          src={getIconSrc(file.mimeType || "")}
          className="size-10 max-w-full"
        />
      </CardHeader>
    </Card>
  );
};

export default FileCard;
