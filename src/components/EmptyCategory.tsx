import EmptyFolderIcon from "@/assets/icons/empty-folder.png";
import Empty from "./Empty";
const EmptyCategory = () => {
  return (
    <Empty
      iconSrc={EmptyFolderIcon}
      title="Sorry! There are no files in this category."
    />
  );
};
export default EmptyCategory;
