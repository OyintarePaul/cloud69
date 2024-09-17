import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import AppBar from "./AppBar";
const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <div className="flex-[0.3] border-r border-r-grey-500">
        <SideBar />
      </div>
      <div className="flex-1">
        <div>
          <AppBar />
        </div>
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
