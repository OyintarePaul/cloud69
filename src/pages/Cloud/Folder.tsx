import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Folder as FolderType } from "@/types";
import { FolderClosed } from "lucide-react";
import { Link } from "react-router-dom";

type IProps = {
  folder: FolderType;
};
const Folder = ({ folder }: IProps) => {
  return (
    <Link to={`/dashboard/cloud/${folder.id}`}>
      <Card>
        <CardHeader>
          <FolderClosed />
          <CardTitle>{folder.name}</CardTitle>
          <CardDescription>3 files</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default Folder;
