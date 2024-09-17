import SignedIn from "@/components/auth/SignedIn";
import Auth from "@/layouts/Auth";
import Dashboard from "@/layouts/Dashboard";
import Favourites from "@/pages/Favourites";
import Trash from "@/pages/Trash";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Cloud from "@/pages/Cloud";
import Overview from "@/pages/Overview";
import Signup from "@/pages/Signup";

import { createBrowserRouter } from "react-router-dom";
import Settings from "@/pages/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/dashboard",
    element: (
      <SignedIn>
        <Dashboard />
      </SignedIn>
    ),
    children: [
      { path: "cloud/:id", element: <Cloud /> },
      {
        path: "overview",
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
    path: "/auth",
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
