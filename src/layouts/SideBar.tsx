import { Server } from "lucide-react";
import NavItems from "./NavItems";

const SideBar = () => {
  return (
    <div className="px-2 py-4">
      <div className="flex gap-2 items-center">
        <Server />
        <span className="font-bold text-lg">Cloud69</span>
      </div>

      <nav className="mt-10">
        <NavItems />
      </nav>
    </div>
  );
};
export default SideBar;
