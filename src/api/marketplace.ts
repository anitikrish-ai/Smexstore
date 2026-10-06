/**
 * ID Buy/Sell Marketplace API (API-006, FR-040 to FR-045)
 */

import { apiClient } from './client';
import {
  Listing,
  CreateListingPayload,
  UpdatePricePayload,
  ListingFilters,
} from '../types/listing';

export const marketplaceApi = {
  getListings: (filters?: ListingFilters) =>
    apiClient<{ listings: Listing[] }>('/marketplace', {
      params: {
        status: filters?.status,
        tag: filters?.tag,
        sort: filters?.sort,
        search: filters?.search,
        gameTitle: filters?.gameTitle,
      },
    }),

  getListingById: (id: string) =>
    apiClient<{ listing: Listing }>(`/marketplace/${encodeURIComponent(id)}`),

  createListing: (payload: CreateListingPayload) =>
    apiClient<{ listing: Listing }>('/marketplace', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updatePrice: (id: string, payload: UpdatePricePayload) =>
    apiClient<{ listing: Listing }>(`/marketplace/${encodeURIComponent(id)}/price`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  markSold: (id: string) =>
    apiClient<{ message: string }>(`/marketplace/${encodeURIComponent(id)}/sold`, {
      method: 'POST',
    }),

  deleteListing: (id: string) =>
    apiClient<{ message: string }>(`/marketplace/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
};
