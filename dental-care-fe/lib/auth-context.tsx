"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  userEmail: string | null;
  isLoading: boolean; // <--- add loading state
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // loading starts as true

  const refreshUser = async () => {
    setIsLoading(true); // start loading
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const { email } = await res.json();
        setIsAuthenticated(true);
        setUserEmail(email);
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
      }
    } catch {
      setIsAuthenticated(false);
      setUserEmail(null);
    }
    setIsLoading(false); // finish loading
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userEmail, isLoading, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
