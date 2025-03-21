// app/providers/index.tsx
'use client';

import React from 'react';
import NotificationProvider from '../ui/information/message';
// Importez d'autres providers ici si nécessaire

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NotificationProvider>
      {/* Vous pouvez imbriquer d'autres providers ici */}
      {children}
    </NotificationProvider>
  );
}