/**
 * Notifications API (API-010, FR-080)
 */

import { apiClient } from './client';
import { Notification } from '../types/notification';

export const notificationsApi = {
  getNotifications: () => apiClient<{ notifications: Notification[] }>('/notifications'),

  markAsRead: (id: string) =>
    apiClient<{ message: string }>(`/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PATCH',
    }),
};
