import { useState, useEffect, useCallback } from 'react';
import { CreateRatingPayload, SellerRatingSummary } from '../types/rating';
import { ratingsApi } from '../api/ratings';

export function useSellerRatings(sellerId: string) {
  const [summary, setSummary] = useState<SellerRatingSummary>({
    average: 0,
    totalCount: 0,
    ratings: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRatings = useCallback(async () => {
    if (!sellerId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await ratingsApi.getSellerRatings(sellerId);
      setSummary(response);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load ratings.');
    } finally {
      setIsLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  return { summary, isLoading, error, refetch: fetchRatings };
}

export function useSubmitRating() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkEligibility = async (sellerId: string, listingId: string) => {
    try {
      const response = await ratingsApi.checkEligibility(sellerId, listingId);
      return response.eligible;
    } catch {
      return false;
    }
  };

  const submitRating = async (payload: CreateRatingPayload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await ratingsApi.submitRating(payload);
      return response;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit rating.';
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitRating, checkEligibility, isSubmitting, error };
}
