"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { UserTypeContext } from '@/types';


type AuthContextType = {
   user: UserTypeContext | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   error: string | null;
   refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
   user: null,
   isAuthenticated: false,
   isLoading: true,
   error: null,
   refreshAuth: async () => { },
});

type AuthProviderProps = {
   children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
   const [user, setUser] = useState<UserTypeContext | null>(null);
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   const checkAuthStatus = async () => {
      try {
         setIsLoading(true);
         setError(null);

         const response = await axios.get(`${window.location.origin}/api/webhook/is-auth`, {
            withCredentials: true
         });

         // console.log('Auth check response:', response.data.userData);

         if (response.data.userData) {
            setUser(response.data.userData);
            setIsAuthenticated(true);
         } else {
            setUser(null);
            setIsAuthenticated(false);
            setError('No user data received');
         }
      } catch (error) {
         console.error('Auth check error:', error);
         setUser(null);
         setIsAuthenticated(false);

         if (axios.isAxiosError(error)) {
            setError(error.response?.data?.error || 'Authentication failed');
         } else {
            setError('Failed to check authentication status');
         }
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      checkAuthStatus();
   }, []);

   const refreshAuth = async () => {
      await checkAuthStatus();
   };

   const value: AuthContextType = {
      user,
      isAuthenticated,
      isLoading,
      error,
      refreshAuth
   };

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useUserAuthentication = () => useContext(AuthContext);