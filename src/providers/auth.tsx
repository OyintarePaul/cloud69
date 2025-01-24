import { account, ID } from "@/appwrite/init";
import { Models } from "appwrite";
import { createContext, useState, useEffect, useContext } from "react";

type User = Models.User<Models.Preferences>;
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: unknown;
  createUser: (email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  createUser: async () => {},
  logIn: async () => {},
  logout: async () => {},
});

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const createUser = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password);
      await logIn(email, password);
    } catch (error) {
      setError(error);
      console.error("Login failed:", error);
    }
  };

  const logIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setUser(user);
    } catch (error) {
      setError(error);
      console.error("Login failed:", error);
    }
  };
  const logout = async () => {
    try {
      await account.deleteSessions();
      setUser(null);
    } catch (error) {
      setError(error);
      console.error("Logout failed:", error);
      // Handle logout errors
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking session");
      try {
        const user = await account.get(); // Fetch user data
        setUser(user); // Set user data
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Always set loading state to false after fetching
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, logIn, createUser, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth };
export default AuthProvider;
