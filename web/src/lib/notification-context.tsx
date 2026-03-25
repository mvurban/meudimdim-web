"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

export interface Notification {
  id: string;
  date: string; // ISO string
  text: string;
  isNew: boolean;
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (text: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAllAsRead: () => {},
});

const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

function storageKey(email: string) {
  return `mdd-notifications-${email}`;
}

function isRecent(dateStr: string) {
  return Date.now() - new Date(dateStr).getTime() < FORTY_EIGHT_HOURS;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const email = session?.user?.email ?? "guest";
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const key = storageKey(email);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed: Notification[] = JSON.parse(saved);
        setNotifications(parsed.filter(n => isRecent(n.date)));
      } catch {
        setNotifications([]);
      }
    }
  }, [email]);

  useEffect(() => {
    if (email === "guest") return;
    localStorage.setItem(storageKey(email), JSON.stringify(notifications));
  }, [notifications, email]);

  const addNotification = useCallback((text: string) => {
    const notification: Notification = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      text,
      isNew: true,
    };
    setNotifications(prev => [notification, ...prev.filter(n => isRecent(n.date))]);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isNew: false })));
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
