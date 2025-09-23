import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { pb } from '../queries/client';
import { RecordModel } from 'pocketbase';

interface AuthContextType {
  user: RecordModel | null;
  complex: RecordModel | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<RecordModel | null>(null);
  const [complex, setComplex] = useState<RecordModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        if (pb.authStore.isValid) {
          const authData = pb.authStore.model;
          if (authData) {
            setUser(authData);
            // Fetch the complex associated with this admin user
            // Assuming admin users have a complex_id field
            if (authData.complex_id) {
              const complexData = await pb.collection('res_complexes').getOne(authData.complex_id);
              setComplex(complexData);
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        pb.authStore.clear();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      setUser(authData.record);
      
      // Fetch the complex associated with this admin user
      if (authData.record.complex_id) {
        const complexData = await pb.collection('res_complexes').getOne(authData.record.complex_id);
        setComplex(complexData);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    setComplex(null);
  };

  const value = {
    user,
    complex,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};