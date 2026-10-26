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

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'order',
    title: 'Pre-Order Ready for Pickup',
    message: 'Cha-Cha’s Kinalas has finished simmering your Special Beef Kinalas. Head to the counter with your Pass QR!',
    timestamp: '5m ago',
    read: false,
    actionUrl: '/basket',
    actionLabel: 'View Active Pass',
    iconName: 'fast-food',
    iconBgColor: '#FFF0ED',
    iconColor: '#D32F2F',
  },
  {
    id: 'notif-2',
    type: 'streak',
    title: 'Keep Your 5-Day Streak Burning',
    message: 'You have not checked in or stamped a tasting dish today. Tap to check in and earn +30 Explorer XP before midnight!',
    timestamp: '42m ago',
    read: false,
    actionUrl: '/streak',
    actionLabel: 'Check In Now',
    iconName: 'flame',
    iconBgColor: '#FFF4E5',
    iconColor: '#FF6A00',
  },
  {
    id: 'notif-3',
    type: 'achievement',
    title: 'New Trophy Unlocked',
    message: 'Congratulations! You earned the "Sili Novice" trophy for logging 3 spicy Bicol dishes. Check your Trophy Vault.',
    timestamp: '3h ago',
    read: false,
    actionUrl: '/streak',
    actionLabel: 'View Trophy',
    iconName: 'trophy',
    iconBgColor: '#FFF9E6',
    iconColor: '#F59E0B',
  },
  {
    id: 'notif-4',
    type: 'community',
    title: 'Maria Santos liked your food crawl post',
    message: 'Your photo dispatch "Sabang Late Night Kinalas Crawl" is getting love from 14 fellow Nagueño foodies.',
    timestamp: '5h ago',
    read: true,
    actionUrl: '/feed',
    actionLabel: 'See Reactions',
    iconName: 'heart',
    iconBgColor: '#FCE7F3',
    iconColor: '#EC4899',
  },
  {
    id: 'notif-5',
    type: 'special',
    title: 'Fresh Toasted Siopao Batch Out',
    message: '365 Modern Bread just took out a warm batch of crispy crust pork siopao at Centro. Still steaming!',
    timestamp: 'Yesterday',
    read: true,
    actionUrl: '/food/toasted-siopao',
    actionLabel: 'Discover Spot',
    iconName: 'pricetag',
    iconBgColor: '#EDE9FE',
    iconColor: '#8B5CF6',
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
