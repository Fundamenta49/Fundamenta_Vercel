import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { PrivacyConsentModal } from '@/components/privacy/PrivacyConsentModal';

// Define auth user type
type AuthUser = {
  id: number;
  name: string;
  email: string;
  role?: string;
  emailVerified?: boolean;
  privacyConsent?: boolean;
};

// Auth tokens type
type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

// User metadata type for registration
type UserMetadata = {
  birthYear?: number;
  ageVerified?: boolean;
  isMinor?: boolean;
  hasParentalConsent?: boolean;
};

// Define auth context state
type AuthContextType = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string, metadata?: UserMetadata) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  showConsent: boolean;
  setPrivacyConsent: (consent: boolean) => Promise<boolean>;
};

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  signUp: async () => false,
  logout: async () => {},
  refreshToken: async () => false,
  loading: true,
  error: null,
  setError: () => {},
  showConsent: false,
  setPrivacyConsent: async () => false,
});

// Auth provider props
type AuthProviderProps = {
  children: ReactNode;
};

// Auth provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Function to check privacy consent
  const checkConsent = async () => {
    try {
      const response = await fetch('/api/auth/consent', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.hasConsent;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to check consent status:', error);
      return false;
    }
  };

  // Initialize auth state from cookies/session on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Call the /me endpoint to check if user is logged in
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Include cookies
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
          
          // Check if user has consented to privacy policy
          if (data.user && !data.user.privacyConsent) {
            const hasConsent = await checkConsent();
            if (!hasConsent) {
              setShowConsent(true);
            }
          }
        } else {
          // Not authenticated or token expired
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
    
    // Set up token refresh interval
    const refreshInterval = setInterval(() => {
      if (isAuthenticated) {
        refreshToken();
      }
    }, 25 * 60 * 1000); // Refresh every 25 minutes
    
    return () => clearInterval(refreshInterval);
  }, [isAuthenticated]);

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: data.expiresIn,
        });
        return true;
      } else {
        // If token refresh fails, log the user out
        await logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      return false;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!email || !password) {
        setError('Email and password are required');
        setLoading(false);
        return false;
      }
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setTokens(data.tokens);
        setIsAuthenticated(true);
        
        // Check if user has given privacy consent
        if (data.user && !data.user.privacyConsent) {
          setShowConsent(true);
        }
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.user.name}!`,
        });
        
        setLoading(false);
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Login failed');
        toast({
          title: "Login failed",
          description: errorData.error || "Invalid credentials",
          variant: "destructive",
        });
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      toast({
        title: "Login error",
        description: "Failed to connect to authentication service",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };
  
  // Sign-up function
  const signUp = async (name: string, email: string, password: string, metadata?: UserMetadata): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          // Include age verification metadata from Phase 2
          ...metadata
        }),
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setTokens(data.tokens);
        setIsAuthenticated(true);
        
        // Always show consent modal for new users
        setShowConsent(true);
        
        toast({
          title: "Registration successful",
          description: `Welcome to Fundamenta Life Skills, ${data.user.name}!`,
        });
        
        setLoading(false);
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Registration failed');
        toast({
          title: "Registration failed",
          description: errorData.error || "Please try again with different information",
          variant: "destructive",
        });
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      setError('Network error. Please try again.');
      toast({
        title: "Registration error",
        description: "Failed to connect to registration service",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with client-side logout even if server logout fails
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setTokens(null);
      setLocation('/login');
    }
  };

  // Set privacy consent
  const setPrivacyConsent = async (consent: boolean): Promise<boolean> => {
    if (!consent) {
      setShowConsent(false);
      return false;
    }
    
    try {
      const response = await fetch('/api/auth/consent', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        setShowConsent(false);
        
        // Update user object with consent
        if (user) {
          setUser({
            ...user,
            privacyConsent: true,
          });
        }
        
        return true;
      } else {
        throw new Error('Failed to record consent');
      }
    } catch (error) {
      console.error('Privacy consent error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        login, 
        signUp, 
        logout, 
        refreshToken,
        loading, 
        error, 
        setError,
        showConsent,
        setPrivacyConsent
      }}
    >
      {showConsent && (
        <PrivacyConsentModal 
          onConsent={() => setPrivacyConsent(true)} 
          onDecline={() => setPrivacyConsent(false)}
        />
      )}
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;