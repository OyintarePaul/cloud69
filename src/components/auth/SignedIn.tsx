import { useAuth } from "@/providers/auth";
import { Navigate } from "react-router";

const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, error } = useAuth();
  if (isLoading) return null;
  if (error || !user) return <Navigate to="/login" />;
  return children;
};
export default SignedIn;
