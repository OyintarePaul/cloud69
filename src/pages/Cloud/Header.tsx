import Actions from "./Actions";
import FolderName from "./FolderName";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <div>
      <div>
        <Navigation />
      </div>
      <div className="flex justify-between items-center">
        <FolderName />
        <Actions />
      </div>
    </div>
  );
};
export default Header;
