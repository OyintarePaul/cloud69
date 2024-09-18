import NewFolder from "./NewFolder";
import UploadFiles from "./UploadFiles";

const Actions = () => {
  return (
    <div className="flex gap-2 items-center px-2">
      <NewFolder />
      <UploadFiles />
    </div>
  );
};
export default Actions;
