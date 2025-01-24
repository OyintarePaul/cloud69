import { useAuth } from "@/providers/auth";
import { Navigate } from "react-router";

const SignedOut = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" />;
  return children;
};
export default SignedOut;
