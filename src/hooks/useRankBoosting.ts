import { useState, useEffect, useCallback } from 'react';
import { RankPackage, CreateBookingPayload } from '../types/rankPackage';
import { rankBoostingApi } from '../api/rankBoosting';

export function useRankBoosting() {
  const [packages, setPackages] = useState<RankPackage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await rankBoostingApi.getPackages();
      setPackages(response.packages || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load rank packages.');
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return { packages, isLoading, error, refetch: fetchPackages };
}

export function useRankPackageDetail(id: string) {
  const [pkg, setPkg] = useState<RankPackage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [bookingProgress, setBookingProgress] = useState<number>(0);

  const fetchPackage = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await rankBoostingApi.getPackageById(id);
      setPkg(response.package);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load package details.');
      setPkg(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPackage();
  }, [fetchPackage]);

  const bookPackage = async (payload: CreateBookingPayload) => {
    setIsBooking(true);
    setBookingProgress(0.3);
    try {
      setBookingProgress(0.7);
      const response = await rankBoostingApi.bookPackage(id, payload);
      setBookingProgress(1.0);
      return response.booking;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to book package.');
      throw err;
    } finally {
      setIsBooking(false);
    }
  };

  return {
    pkg,
    isLoading,
    error,
    isBooking,
    bookingProgress,
    bookPackage,
    refetch: fetchPackage,
  };
}
