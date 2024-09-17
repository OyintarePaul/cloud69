import { useAuth } from "@/providers/auth";
import { Navigate } from "react-router-dom";

const SignedIn = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, error } = useAuth();
  if (isLoading) return null;
  if (!user || error != null) return <Navigate to="/auth/login" />;
  return children;
};
export default SignedIn;
