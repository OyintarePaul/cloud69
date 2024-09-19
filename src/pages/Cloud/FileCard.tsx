import { Card, CardHeader } from "@/components/ui/card";
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
      </CardHeader>
    </Card>
  );
};

export default FileCard;
