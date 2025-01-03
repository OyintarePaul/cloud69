import { Server } from "lucide-react";
import { Outlet } from "react-router";

const Auth = () => {
  return (
    <div className="p-4 max-w-sm mx-auto flex flex-col items-center justify-center min-h-screen">
      <div className="flex gap-2 items-center mb-4">
        <Server />
        <h1 className="text-3xl font-bold">Cloud69</h1>
      </div>
      <Outlet />
    </div>
  );
};
export default Auth;
