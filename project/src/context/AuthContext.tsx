import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  grade?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (credentials: any) => Promise<{ success: boolean; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ success: boolean; error?: string }>;
  loginDirectly: (user: User) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User } }
  | { type: 'AUTH_FAIL'; payload: string | null }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: Partial<User> };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getMe();
          // response.data is the user object directly
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: response.data as any
            }
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: 'AUTH_FAIL', payload: null });
        }
      } else {
        dispatch({ type: 'AUTH_FAIL', payload: null });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: any): Promise<{ success: boolean; error?: string }> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.login(credentials);
      
      const user = response.data.user || response.data;
      const token = response.data.token;
      
      // Store token for API requests
      if (token) {
        localStorage.setItem('token', token);
      }
      localStorage.removeItem('user');
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user }
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAIL', payload: message });
      return { success: false, error: message };
    }
  };

  // Register function
  const register = async (userData: any): Promise<{ success: boolean; error?: string }> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.register(userData);
      
      const user = response.data.user || response.data;
      const token = response.data.token;
      
      // Store token for API requests
      if (token) {
        localStorage.setItem('token', token);
      }
      localStorage.removeItem('user');
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user }
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAIL', payload: message });
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Update profile function
  const updateProfile = async (data: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authAPI.updateProfile(data);
      const userData = (response.data as any).user || response.data;
      dispatch({
        type: 'UPDATE_USER',
        payload: userData
      });
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Update failed';
      return { success: false, error: message };
    }
  };

  // Direct login function (for auto-login after password reset)
  const loginDirectly = (user: User) => {
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { user }
    });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    loginDirectly,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a safe default to avoid crashes when components
    // are rendered outside the provider during HMR or tests.
    return {
      ...initialState,
      login: async () => ({ success: false }),
      register: async () => ({ success: false }),
      logout: async () => {},
      updateProfile: async () => ({ success: false }),
      loginDirectly: () => {},
      clearError: () => {},
    };
  }
  return context;
};

export default AuthContext;
