import { ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  grade?: string;
  parentId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
  // Direct login used after password reset to set auth state without calling login API
  loginDirectly?: (user: any) => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export declare const useAuth: () => AuthContextType;
export declare const AuthProvider: React.FC<AuthProviderProps>; 