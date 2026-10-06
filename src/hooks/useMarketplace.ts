import { useState, useEffect, useCallback } from 'react';
import {
  Listing,
  CreateListingPayload,
  UpdatePricePayload,
  ListingFilters,
} from '../types/listing';
import { marketplaceApi } from '../api/marketplace';

export function useMarketplace(filters?: ListingFilters) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await marketplaceApi.getListings(filters);
      setListings(response.listings || []);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to load marketplace listings.',
      );
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status, filters?.tag, filters?.sort, filters?.search, filters?.gameTitle]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return { listings, isLoading, error, refetch: fetchListings };
}

export function useListingDetail(id: string) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await marketplaceApi.getListingById(id);
      setListing(response.listing);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load listing details.');
      setListing(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const updatePrice = async (payload: UpdatePricePayload) => {
    const response = await marketplaceApi.updatePrice(id, payload);
    setListing(response.listing);
    return response.listing;
  };

  const markSold = async () => {
    await marketplaceApi.markSold(id);
    await fetchDetail();
  };

  const deleteListing = async () => {
    await marketplaceApi.deleteListing(id);
  };

  return {
    listing,
    isLoading,
    error,
    refetch: fetchDetail,
    updatePrice,
    markSold,
    deleteListing,
  };
}

export function useCreateListing() {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createListing = async (payload: CreateListingPayload) => {
    setIsSubmitting(true);
    setError(null);
    setUploadProgress(0.2); // Initial progress

    try {
      // Simulate real progress step tracking for upload before API completion
      setUploadProgress(0.6);
      const response = await marketplaceApi.createListing(payload);
      setUploadProgress(1.0);
      return response.listing;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to publish listing.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createListing, uploadProgress, isSubmitting, error };
}
