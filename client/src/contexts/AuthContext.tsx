import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { toast } from "react-hot-toast";
import type { User, LoginCredentials, RegisterCredentials } from "../lib/api";
import { useLogin, useRegister, useMe, useIsAuth } from "../hooks/useAuth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const { data: meData, isLoading: meLoading } = useMe();
  const { data: isAuthData, isLoading: isAuthLoading } = useIsAuth();

  useEffect(() => {
    if (!meLoading && !isAuthLoading) {
      // Try me endpoint first, then fallback to isAuth
      if (meData) {
        setUser(meData);
        setLoading(false);
      } else if (isAuthData?.success && isAuthData.user) {
        setUser(isAuthData.user);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    }
  }, [meData, meLoading, isAuthData, isAuthLoading]);

  const login = async (credentials: LoginCredentials) => {
    try {
      const { token, user } = await loginMutation.mutateAsync(credentials);
      localStorage.setItem("token", token);
      setUser(user);
      toast.success(`Welcome back, ${user.name}!`);
      // Redirect to dashboard after successful login
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const { token, user } = await registerMutation.mutateAsync(credentials);
      localStorage.setItem("token", token);
      setUser(user);
      toast.success(`Account created successfully! Welcome, ${user.name}!`);
      // Redirect to dashboard after successful registration
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
    // Redirect to home page after logout
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
