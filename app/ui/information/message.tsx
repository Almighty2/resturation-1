// app/providers/notification-provider.tsx
'use client';

import React, { createContext, useContext } from 'react';
import { message } from 'antd';

// Types de notifications
type NotificationType = 'success' | 'error' | 'warning' | 'info';

// Interface pour les options de notification
interface NotificationOptions {
  content: React.ReactNode;
  duration?: number;
  onClose?: () => void;
}

// Interface du contexte
interface NotificationContextType {
  success: (content: React.ReactNode, duration?: number, onClose?: () => void) => void;
  error: (content: React.ReactNode, duration?: number, onClose?: () => void) => void;
  warning: (content: React.ReactNode, duration?: number, onClose?: () => void) => void;
  info: (content: React.ReactNode, duration?: number, onClose?: () => void) => void;
  notify: (type: NotificationType, options: NotificationOptions) => void;
}

// Création du contexte
const NotificationContext = createContext<NotificationContextType | null>(null);

// Hook personnalisé pour utiliser les notifications
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification doit être utilisé à l\'intérieur d\'un NotificationProvider');
  }
  return context;
};

// Props du provider
interface NotificationProviderProps {
  children: React.ReactNode;
}

// Provider de notification
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  // Fonction générique pour afficher une notification
  const notify = (type: NotificationType, options: NotificationOptions) => {
    messageApi.open({
      type,
      content: options.content,
      duration: options.duration || 3,
      onClose: options.onClose,
    });
  };

  // Fonctions de raccourci pour chaque type de notification
  const success = (content: React.ReactNode, duration?: number, onClose?: () => void) => {
    notify('success', { content, duration, onClose });
  };

  const error = (content: React.ReactNode, duration?: number, onClose?: () => void) => {
    notify('error', { content, duration, onClose });
  };

  const warning = (content: React.ReactNode, duration?: number, onClose?: () => void) => {
    notify('warning', { content, duration, onClose });
  };

  const info = (content: React.ReactNode, duration?: number, onClose?: () => void) => {
    notify('info', { content, duration, onClose });
  };

  // Valeur du contexte
  const contextValue: NotificationContextType = {
    success,
    error,
    warning,
    info,
    notify,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;