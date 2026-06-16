declare module "*.jsx" {
  import React from "react";
  const Component: React.ComponentType<any>;
  export default Component;
}

declare module "*.js" {
  const content: any;
  export default content;
}

declare module "./context/AuthContext" {
  import React from "react";

  interface AuthContextType {
    user: any;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (credentials: {
      email: string;
      password: string;
    }) => Promise<{ success: boolean; error?: string }>;
    register: (userData: any) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    updateProfile: (data: any) => Promise<{ success: boolean; error?: string }>;
    clearError: () => void;
    // Allow direct login after password reset (auto-login)
    loginDirectly?: (user: any) => void;
  }

  export const AuthProvider: React.ComponentType<{ children: React.ReactNode }>;
  export const useAuth: () => AuthContextType;
  export default AuthContextType;
}

declare module "./components/ProtectedRoute" {
  import React from "react";

  interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: string[];
  }

  const ProtectedRoute: React.ComponentType<ProtectedRouteProps>;
  export default ProtectedRoute;
}

declare module "./pages/Login" {
  import React from "react";
  const Login: React.ComponentType;
  export default Login;
}

declare module "./pages/Register" {
  import React from "react";
  const Register: React.ComponentType;
  export default Register;
}
