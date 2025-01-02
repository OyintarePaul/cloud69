import { useAuth } from "@/providers/auth";
import { Navigate } from "react-router";

const SignedOut = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to="/" />;
  return children;
};
export default SignedOut;
