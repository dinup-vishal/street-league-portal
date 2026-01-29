/**
 * Auth Context
 * Manages authentication state across the application
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'coordinator' | 'staff' | 'program_manager';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_CREDENTIALS = {
  'admin@streetleague.com': { password: 'admin123', role: 'admin' as const },
  'coordinator@streetleague.com': { password: 'coord123', role: 'coordinator' as const },
  'staff@streetleague.com': { password: 'staff123', role: 'staff' as const },
  'manager@streetleague.com': { password: 'manager123', role: 'program_manager' as const },
};

const AUTH_STORAGE_KEY = 'street-league:auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData);
      } catch (error) {
        console.error('Failed to load auth data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const cred = MOCK_CREDENTIALS[email as keyof typeof MOCK_CREDENTIALS];
      if (!cred || cred.password !== password) {
        throw new Error('Invalid credentials');
      }

      const userData: User = {
        id: email.split('@')[0],
        email,
        name: email.split('@')[0]
          .split('.')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
        role: cred.role,
      };

      setUser(userData);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
