'use client';

import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { getQueryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/context/AuthContext';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { User } from '@/types/api.types';

export const AppProviders: React.FC<{
  children: React.ReactNode;
  initialUser?: User | null;
}> = ({ children, initialUser }) => {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider initialUser={initialUser}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#333',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '8px',
              },
              success: {
                style: {
                  background: '#16a34a',
                  color: '#fff',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#16a34a',
                },
              },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default AppProviders;
