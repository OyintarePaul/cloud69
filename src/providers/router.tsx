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

import { createBrowserRouter } from "react-router";
import SignedOut from "@/components/auth/SignedOut";
import Category from "@/pages/Category";
import SearchResults from "@/pages/SearchResults";

const router = createBrowserRouter(
  [
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
        {
          path: "category/:categoryName",
          element: <Category />,
        },
        {
          path: "search",
          element: <SearchResults />,
        },
      ],
    },
    {
      element: (
        <SignedOut>
          <Auth />,
        </SignedOut>
      ),
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
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default router;
