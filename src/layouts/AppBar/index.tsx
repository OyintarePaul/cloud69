import ModeToggle from "@/layouts/AppBar/ModeToggle";
import Search from "@/layouts/AppBar/Search";
import UserProfileDropdown from "@/layouts/AppBar/UserProfileDropdown";
import MobileNav from "../MobileNav";

const AppBar = () => {
  return (
    <div className="px-4 py-2 flex justify-between items-center border-b">
      <div className="flex gap-2 items-center">
        <MobileNav />
        <Search />
      </div>
      <div className="flex gap-2 items-center">
        <ModeToggle />
        <UserProfileDropdown />
      </div>
    </div>
  );
};
export default AppBar;
