import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, getQueryFn } from '@/lib/queryClient';

interface User {
  id: string;
  username: string;
  fullName: string;
  phone: string;
  role: 'worker' | 'employer' | 'ngo' | 'admin';
  language: string;
  location: string | null;
  skills: string[] | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // Query to get current user
  const {
    data: user,
    isLoading,
    refetch: refetchUser
  } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/logout');
    },
    onSuccess: () => {
      // Clear all queries and redirect will be handled by the auth state change
      queryClient.clear();
    }
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  // Ensure user is properly typed - if it's an empty object from 401, treat as null
  const validUser = user && typeof user === 'object' && 'id' in user ? user as User : null;
  
  const value: AuthContextType = {
    user: validUser,
    isLoading,
    isAuthenticated: !!validUser,
    logout,
    refetchUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to check if user has a specific role
export function useHasRole(role: string): boolean {
  const { user } = useAuth();
  return user?.role === role;
}

// Hook to check if user can access employer features
export function useIsEmployer(): boolean {
  return useHasRole('employer');
}

// Hook to check if user can access worker features
export function useIsWorker(): boolean {
  return useHasRole('worker');
}