"use client"

import React, { createContext, useContext, ReactNode } from 'react';

interface ImageKitConfig {
  publicKey: string;
  urlEndpoint: string;
}

interface ImageKitContextType {
  config: ImageKitConfig;
  getAuthParams: () => Promise<{
    signature: string;
    expire: string;
    token: string;
    publicKey: string;
  }>;
}

const ImageKitContext = createContext<ImageKitContextType | null>(null);

interface ImageKitProviderProps {
  children: ReactNode;
}

export const ImageKitProvider: React.FC<ImageKitProviderProps> = ({ children }) => {
  const config: ImageKitConfig = {
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
  };

  const getAuthParams = async () => {
    try {
      const response = await fetch('/api/imagekit-auth');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error('ImageKit authentication error:', error);
      throw new Error('Authentication request failed');
    }
  };

  const value: ImageKitContextType = {
    config,
    getAuthParams,
  };

  return (
    <ImageKitContext.Provider value={value}>
      {children}
    </ImageKitContext.Provider>
  );
};

export const useImageKit = (): ImageKitContextType => {
  const context = useContext(ImageKitContext);
  if (!context) {
    throw new Error('useImageKit must be used within an ImageKitProvider');
  }
  return context;
};
