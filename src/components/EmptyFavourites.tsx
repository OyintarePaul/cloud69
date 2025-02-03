import EmptyFolderIcon from "@/assets/icons/empty-folder.png";
import Empty from "./Empty";
const EmptyFavourites = () => {
  return (
    <Empty iconSrc={EmptyFolderIcon} title="You favourites list is empty." />
  );
};
export default EmptyFavourites;
