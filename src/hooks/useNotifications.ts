import { useState, useEffect, useCallback } from 'react';
import { Notification } from '../types/notification';
import { notificationsApi } from '../api/notifications';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationsApi.getNotifications();
      setNotifications(response.notifications || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications.');
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readState: true } : n)),
      );
    } catch {
      // Ignore failure to update read state
    }
  };

  const unreadCount = notifications.filter((n) => !n.readState).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch: fetchNotifications,
    markAsRead,
  };
}
