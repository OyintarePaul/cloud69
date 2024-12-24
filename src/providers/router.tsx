import SignedIn from "@/components/auth/SignedIn";
import Auth from "@/layouts/Auth";
import Dashboard from "@/layouts/Dashboard";
import Favourites from "@/pages/Favourites";
import Trash from "@/pages/Trash";
import Login from "@/pages/Login";
import Cloud from "@/pages/Cloud";
import Overview from "@/pages/Overview";
import Signup from "@/pages/Signup";
import Settings from "@/pages/Settings";

import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: (
      <SignedIn>
        <Dashboard />
      </SignedIn>
    ),
    children: [
      {
        path: "cloud/:id",
        element: <Cloud />,
      },
      {
        path: "/",
        element: <Overview />,
      },
      {
        path: "favourites",
        element: <Favourites />,
      },
      { path: "trash", element: <Trash /> },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    element: <Auth />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "sign-up",
        element: <Signup />,
      },
    ],
  },
]);

export default router;
