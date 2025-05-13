import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AUTH_ENDPOINTS, STORAGE_KEYS, DEFAULT_AUTH_STATE } from '../config';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(DEFAULT_AUTH_STATE);

  // Load from localStorage on initial render
  useEffect(() => {
    const loadUserFromStorage = () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userString = localStorage.getItem(STORAGE_KEYS.USER);
      
      if (token && userString) {
        try {
          const user = JSON.parse(userString);
          setState({ 
            isAuthenticated: true, 
            token, 
            user, 
            loading: false 
          });
          
          // Verify token validity with the backend
          fetchUserProfile(token);
        } catch (error) {
          console.error('Failed to parse user data from localStorage:', error);
          logout();
        }
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    };
    
    loadUserFromStorage();
  }, []);
  
  // Fetch user profile to validate token
  const fetchUserProfile = async (token: string) => {
    try {
      console.log("Fetching user profile with token:", token.substring(0, 10) + '...');
      
      const response = await fetch(AUTH_ENDPOINTS.PROFILE, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.error("Profile fetch failed:", response.status, response.statusText);
        throw new Error('Token invalid');
      }
      
      const userData = await response.json();
      console.log("User profile fetched:", userData);
      
      // Update user data
      setState(prev => ({ 
        ...prev, 
        user: userData,
        isAuthenticated: true
      }));
      
      // Update localStorage
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      
    } catch (error) {
      console.error('Failed to verify token:', error);
      logout();
    }
  };
  
  // Login function
  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      console.log("Logging in with:", email);
      
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      console.log("Login response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Server error: ${response.status}` }));
        console.error("Login error data:", errorData);
        throw new Error(errorData.error || 'Login failed');
      }
      
      const data = await response.json();
      console.log("Login successful:", data);
      
      // Save to state
      setState({ 
        isAuthenticated: true, 
        token: data.token, 
        user: data.user,
        loading: false 
      });
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false }));
      console.error("Login error:", error);
      throw error;
    }
  };
  
  // Register function
  const register = async (name: string, email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
      
      const data = await response.json();
      
      // Save to state
      setState({ 
        isAuthenticated: true, 
        token: data.token, 
        user: data.user,
        loading: false 
      });
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };
  
  // Logout function
  const logout = () => {
    // Clear state
    setState({ 
      isAuthenticated: false, 
      token: null, 
      user: null,
      loading: false 
    });
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    
    console.log("User logged out");
  };
  
  // Create context value
  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 