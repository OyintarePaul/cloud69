import { Outlet } from "react-router";
import SideBar from "./SideBar";
import AppBar from "./AppBar";
const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <div className="md:flex-[0.25] max-w-56 hidden md:block border-r border-r-grey-500 h-full">
        <SideBar />
      </div>
      <div className="flex-1 h-full">
        <div>
          <AppBar />
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
