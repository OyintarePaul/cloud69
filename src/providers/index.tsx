import { RouterProvider } from "react-router/dom";
import router from "./router";
import AuthProvider from "./auth";
import QueryProvider from "./query";
import { ThemeProvider } from "./theme";

const Providers = () => {
  return (
    <>
      <ThemeProvider defaultTheme="light">
        <QueryProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </>
  );
};
export default Providers;
