"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { api } from "./api";

export interface Notification {
  id: string;
  createdAt: string;
  text: string;
  isNew: boolean;
  status: 'info' | 'warning' | 'error' | 'success';
  metadata?: string; // JSON: { tickers: [{id: string, ticker: string}] }
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (text: string, status?: Notification['status'], metadata?: string) => Promise<Notification | null>;
  markAllAsRead: () => Promise<void>;
  updateNotificationStatus: (id: string, status: Notification['status']) => Promise<void>;
  clearNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  addNotification: async () => null,
  markAllAsRead: async () => {},
  updateNotificationStatus: async () => {},
  clearNotifications: async () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await api.get<Notification[]>("/api/notifications");
      setNotifications(data);
    } catch {
      // silencioso — não queremos loop de erro reportando erro
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchNotifications();
  }, [status, fetchNotifications]);

  const addNotification = useCallback(async (
    text: string,
    notifStatus: Notification['status'] = 'info',
    metadata?: string,
  ): Promise<Notification | null> => {
    try {
      const created = await api.post<Notification>("/api/notifications", { text, status: notifStatus, metadata });
      setNotifications(prev => [created, ...prev]);
      return created;
    } catch {
      return null;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch("/api/notifications/read");
      setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
    } catch {
      // silencioso
    }
  }, []);

  const updateNotificationStatus = useCallback(async (id: string, notifStatus: Notification['status']) => {
    try {
      await api.patch(`/api/notifications/${id}`, { status: notifStatus });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: notifStatus } : n));
    } catch {
      // silencioso
    }
  }, []);

  const clearNotifications = useCallback(async () => {
    try {
      await api.delete("/api/notifications");
      setNotifications([]);
    } catch {
      // silencioso
    }
  }, []);

  const unreadCount = notifications.filter(n => n.isNew).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllAsRead, updateNotificationStatus, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
