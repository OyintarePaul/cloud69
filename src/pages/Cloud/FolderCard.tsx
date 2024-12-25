import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Folder } from "@/types";
import { FolderClosed } from "lucide-react";
import { Link } from "react-router";
import FolderOptions from "./FolderOptions";
import FolderContentCount from "./FolderContentCount";

type IProps = {
  folder: Folder;
};
const FolderCard = ({ folder }: IProps) => {
  return (
    <Link to={`/cloud/${folder.id}`}>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <FolderClosed />
            <FolderOptions resource={folder} />
          </div>
          <CardTitle>{folder.name}</CardTitle>
          <CardDescription>
            <FolderContentCount folderID={folder.id} />
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default FolderCard;
