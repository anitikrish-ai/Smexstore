import { useState, useEffect, useCallback } from 'react';
import { Tournament, TournamentFilters } from '../types/tournament';
import { tournamentsApi } from '../api/tournaments';

export function useTournaments(filters?: TournamentFilters) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await tournamentsApi.getTournaments(filters);
      setTournaments(response.tournaments || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load tournaments.');
      setTournaments([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status, filters?.game, filters?.search, filters?.limit]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  return { tournaments, isLoading, error, refetch: fetchTournaments };
}

export function useTournamentDetail(id: string) {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await tournamentsApi.getTournamentById(id);
      setTournament(response.tournament);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load tournament detail.');
      setTournament(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { tournament, isLoading, error, refetch: fetchDetail };
}
