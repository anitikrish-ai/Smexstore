/**
 * Ratings API (API-009, FR-050, SEC-008)
 */

import { apiClient } from './client';
import { CreateRatingPayload, SellerRatingSummary } from '../types/rating';

export const ratingsApi = {
  checkEligibility: (sellerId: string, listingId: string) =>
    apiClient<{ eligible: boolean; reason?: string }>('/ratings/eligibility', {
      params: { sellerId, listingId },
    }),

  submitRating: (payload: CreateRatingPayload) =>
    apiClient<{ message: string; ratingId: string }>('/ratings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getSellerRatings: (sellerId: string) =>
    apiClient<SellerRatingSummary>(`/ratings/seller/${encodeURIComponent(sellerId)}`),
};
