import EmptyFolderIcon from "@/assets/icons/empty-folder.png";
import Empty from "./Empty";
const EmptyFolder = () => {
  return (
    <Empty
      iconSrc={EmptyFolderIcon}
      title="Oops! This folder is empty."
      subtitle="Use the buttons above to add files or folders."
    />
  );
};
export default EmptyFolder;
