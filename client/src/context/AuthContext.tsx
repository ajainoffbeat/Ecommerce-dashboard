import axiosInstance from "@/config/axios";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  loading: boolean; // Add loading state
}

// Create AuthContext
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  loading: true, // Default loading state
});

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get("/whoami");
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Stop loading after the check
      }
    };
    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    setLoading(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setLoading(false);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
