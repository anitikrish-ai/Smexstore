/**
 * Sessions & Devices API (API-002, DEV-001 to DEV-004)
 */

import { apiClient } from './client';
import { SessionDevice, LoginHistoryItem } from '../types/session';

export const sessionsApi = {
  getActiveSessions: () => apiClient<{ sessions: SessionDevice[] }>('/sessions'),

  getLoginHistory: () => apiClient<{ history: LoginHistoryItem[] }>('/sessions/history'),

  revokeSession: (sessionId: string) =>
    apiClient<{ message: string }>(`/sessions/${encodeURIComponent(sessionId)}`, {
      method: 'DELETE',
    }),
};
