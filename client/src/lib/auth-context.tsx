import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';

// Define auth user type
type AuthUser = {
  name: string;
  email: string;
  role?: string;
};

// Define auth context state
type AuthContextType = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
  loading: true,
});

// Auth provider props
type AuthProviderProps = {
  children: ReactNode;
};

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const checkAuth = () => {
      // Check for admin bypass
      const adminBypass = localStorage.getItem('admin_bypass');
      
      if (adminBypass === 'enabled') {
        // Create an admin user session automatically
        const userData: AuthUser = {
          name: 'Admin User',
          email: 'admin@fundamenta.app',
          role: 'admin'
        };
        
        setIsAuthenticated(true);
        setUser(userData);
        
        // Store in auth data as well for consistency
        localStorage.setItem('auth', JSON.stringify({
          isAuthenticated: true,
          user: userData
        }));
        
        setLoading(false);
        return;
      }
      
      // Regular auth check
      const authData = localStorage.getItem('auth');
      
      if (authData) {
        try {
          const { isAuthenticated, user } = JSON.parse(authData);
          setIsAuthenticated(isAuthenticated);
          setUser(user);
        } catch (error) {
          console.error('Failed to parse auth data', error);
          // Clear invalid auth data
          localStorage.removeItem('auth');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function - in a real app, this would call an API
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Demo admin login - in production, this would validate credentials with a server
    if (email === 'admin@fundamenta.app' && password === 'admin123') {
      const userData: AuthUser = {
        name: 'Admin User',
        email: email,
        role: 'admin'
      };
      
      setIsAuthenticated(true);
      setUser(userData);
      
      // Store auth data in localStorage
      localStorage.setItem('auth', JSON.stringify({
        isAuthenticated: true,
        user: userData
      }));
      
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth');
    setLocation('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;