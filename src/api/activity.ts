/**
 * Activity History API (API-012, FR-100 to FR-102, SEC-006)
 */

import { apiClient } from './client';
import { Activity, LogActivityPayload } from '../types/activity';
import { ActivityVisibility } from '../types/user';

export const activityApi = {
  logActivity: (payload: LogActivityPayload) =>
    apiClient<{ message: string }>('/activity', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getActivityHistory: () =>
    apiClient<{ activities: Activity[]; visibility: ActivityVisibility }>('/activity'),

  updateActivityVisibility: (visibility: ActivityVisibility) =>
    apiClient<{ message: string }>('/activity/visibility', {
      method: 'PUT',
      body: JSON.stringify({ visibility }),
    }),
};
