import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import AppBar from "./AppBar";
const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <div className="flex-[0.3] border-r border-r-grey-500 h-full">
        <SideBar />
      </div>
      <div className="flex-1 h-full overflow-hidden">
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
