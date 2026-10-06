import { useState, useEffect, useCallback } from 'react';
import { LeaderboardData } from '../types/content';
import { leaderboardApi } from '../api/leaderboard';

export function useLeaderboard() {
  const [data, setData] = useState<LeaderboardData>({
    topTournaments: [],
    hotTeams: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await leaderboardApi.getLeaderboard();
      setData({
        topTournaments: response.topTournaments || [],
        hotTeams: response.hotTeams || [],
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard data.');
      setData({ topTournaments: [], hotTeams: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return { data, isLoading, error, refetch: fetchLeaderboard };
}
