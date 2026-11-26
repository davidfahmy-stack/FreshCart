'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthSuccessResponse } from '../types/api.types';
import { authApi, SigninInput, SignupInput } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: SigninInput) => Promise<AuthSuccessResponse>;
  register: (data: SignupInput) => Promise<AuthSuccessResponse>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  initialUser?: User | null;
}> = ({ children, initialUser = null }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(!initialUser);

  const fetchSession = async () => {
    try {
      setIsLoading(true);
      const res = await authApi.getSession();
      setUser(res.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialUser) {
      fetchSession();
    }
  }, [initialUser]);

  const login = async (data: SigninInput): Promise<AuthSuccessResponse> => {
    const res = await authApi.signin(data);
    setUser(res.user);
    return res;
  };

  const register = async (data: SignupInput): Promise<AuthSuccessResponse> => {
    const res = await authApi.signup(data);
    setUser(res.user);
    return res;
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  };

  const refetchUser = async (): Promise<void> => {
    await fetchSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
