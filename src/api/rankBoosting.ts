/**
 * Rank-Boosting Booking API (API-007, FR-050a to FR-050c)
 */

import { apiClient } from './client';
import { RankPackage, RankBooking, CreateBookingPayload } from '../types/rankPackage';

export const rankBoostingApi = {
  getPackages: () => apiClient<{ packages: RankPackage[] }>('/rank-boosting'),

  getPackageById: (id: string) =>
    apiClient<{ package: RankPackage }>(`/rank-boosting/${encodeURIComponent(id)}`),

  bookPackage: (packageId: string, payload: CreateBookingPayload) =>
    apiClient<{ booking: RankBooking }>(
      `/rank-boosting/${encodeURIComponent(packageId)}/book`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    ),
};
