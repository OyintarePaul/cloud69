import Actions from "./Actions";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <div>
      <div>
        <Navigation />
      </div>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl p-2">Root</h1>
        <Actions />
      </div>
    </div>
  );
};
export default Header;
