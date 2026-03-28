"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { api } from "./api";

export interface Notification {
  id: string;
  createdAt: string;
  text: string;
  isNew: boolean;
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (text: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  addNotification: async () => {},
  markAllAsRead: async () => {},
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

  const addNotification = useCallback(async (text: string) => {
    try {
      const created = await api.post<Notification>("/api/notifications", { text });
      setNotifications(prev => [created, ...prev]);
    } catch {
      // silencioso
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

  const unreadCount = notifications.filter(n => n.isNew).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
