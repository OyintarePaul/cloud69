import EmptyFolderIcon from "@/assets/icons/empty-folder.png";
const EmptyFolder = () => {
  return (
    <div className="h-50 flex flex-col items-center justify-center">
      <img src={EmptyFolderIcon} className="w-80 h-80" />
      <p className="w-3/4 text-center text-muted-foreground text-2xl font-semibold">
        Oops! This folder is empty. Use the buttons above to add files or
        folders.
      </p>
    </div>
  );
};
export default EmptyFolder;
