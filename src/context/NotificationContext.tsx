import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

export type NotificationType = 'order' | 'streak' | 'achievement' | 'community' | 'special';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // e.g. "Just now", "15m ago", "1h ago", "Yesterday"
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  iconName: string;
  iconBgColor: string;
  iconColor: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'read' | 'timestamp'>) => void;
}

// Clean initial notifications for a new user: a welcoming introductory tip rather than dummy order history
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-welcome',
    type: 'special',
    title: 'Welcome to Masaen! 🌶️',
    message: 'Explore authentic Bicolano dishes, join curated food trails, and earn stamps in your tasting journal!',
    timestamp: 'Just now',
    read: false,
    actionUrl: '/explore',
    actionLabel: 'Explore Dishes',
    iconName: 'restaurant',
    iconBgColor: '#FFF4E5',
    iconColor: '#DF5D36',
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const addNotification = useCallback(
    (item: Omit<NotificationItem, 'id' | 'read' | 'timestamp'>) => {
      const newNotification: NotificationItem = {
        ...item,
        id: `notif-${Date.now()}`,
        read: false,
        timestamp: 'Just now',
      };
      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
