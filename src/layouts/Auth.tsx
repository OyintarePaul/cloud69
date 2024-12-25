import { Outlet } from "react-router";

const Auth = () => {
  return (
    <div className="p-4 max-w-md mx-auto flex items-center justify-center min-h-screen">
      <Outlet />
    </div>
  );
};
export default Auth;
