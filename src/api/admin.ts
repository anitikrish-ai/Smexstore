/**
 * Elevated Admin Management API (API-013, ADM-001 to ADM-002)
 */

import { apiClient } from './client';
import { AdminPlatformStats } from '../types/api';
import { ListingStatus } from '../types/listing';

export const adminApi = {
  getPlatformStats: () => apiClient<AdminPlatformStats>('/admin/stats'),

  moderateMarketplaceListing: (id: string, status: ListingStatus) =>
    apiClient<{ message: string }>(
      `/admin/marketplace/${encodeURIComponent(id)}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      },
    ),
};
