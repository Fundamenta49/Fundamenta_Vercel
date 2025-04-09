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
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  signUp: async () => false,
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
    
    try {
      // Prevent empty credentials
      if (!email || !password) {
        console.error('Email and password are required');
        setLoading(false);
        return false;
      }
      
      // Demo admin login - in production, this would validate credentials with a server
      if (email.toLowerCase() === 'admin@fundamenta.app' && password === 'admin123') {
        const userData: AuthUser = {
          name: 'Admin User',
          email: email,
          role: 'admin'
        };
        
        setIsAuthenticated(true);
        setUser(userData);
        
        // Store auth data in localStorage with error handling
        try {
          localStorage.setItem('auth', JSON.stringify({
            isAuthenticated: true,
            user: userData
          }));
        } catch (storageError) {
          console.error('Failed to save auth state:', storageError);
          // Continue anyway since we've already set the in-memory state
        }
        
        setLoading(false);
        return true;
      }
      
      // Check if this is a registered user
      try {
        const registeredUsers = localStorage.getItem('registered_users');
        if (registeredUsers) {
          const users = JSON.parse(registeredUsers);
          
          // Case-insensitive email comparison
          const userMatch = users.find((user: any) => 
            user.email.toLowerCase() === email.toLowerCase() && user.password === password
          );
          
          if (userMatch) {
            console.log('User authenticated successfully');
            
            const userData: AuthUser = {
              name: userMatch.name,
              email: userMatch.email,
              role: 'user'
            };
            
            setIsAuthenticated(true);
            setUser(userData);
            
            // Store auth data in localStorage with error handling
            try {
              localStorage.setItem('auth', JSON.stringify({
                isAuthenticated: true,
                user: userData
              }));
            } catch (storageError) {
              console.error('Failed to save auth state:', storageError);
              // Continue anyway since we've already set the in-memory state
            }
            
            setLoading(false);
            return true;
          } else {
            console.log('Invalid credentials - no matching user found');
          }
        } else {
          console.log('No registered users found');
        }
      } catch (parseError) {
        console.error('Error parsing registered users:', parseError);
        // Clear corrupted data
        localStorage.removeItem('registered_users');
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };
  
  // Sign-up function to register new users
  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Add loading state to prevent multiple signups
      setLoading(true);
      
      // Check if user already exists
      const registeredUsers = localStorage.getItem('registered_users');
      let users = registeredUsers ? JSON.parse(registeredUsers) : [];
      
      // Case-insensitive email check to prevent duplicate registrations
      const existingUser = users.find((user: any) => 
        user.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
        console.log('User already exists with this email');
        setLoading(false);
        return false; // User already exists
      }
      
      // Register new user
      const newUser = { name, email, password };
      users.push(newUser);
      
      // Store updated users list in local storage
      try {
        localStorage.setItem('registered_users', JSON.stringify(users));
      } catch (storageError) {
        console.error('Failed to save user to localStorage:', storageError);
        setLoading(false);
        return false;
      }
      
      console.log('Successfully registered user');
      
      // Auto-login after registration
      const userData: AuthUser = {
        name: name,
        email: email,
        role: 'user'
      };
      
      setIsAuthenticated(true);
      setUser(userData);
      
      // Store auth data in localStorage
      try {
        localStorage.setItem('auth', JSON.stringify({
          isAuthenticated: true,
          user: userData
        }));
      } catch (authStorageError) {
        console.error('Failed to save auth state:', authStorageError);
        // Continue anyway, as the user is authenticated in memory
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Sign-up error:', error);
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth');
    setLocation('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signUp, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;