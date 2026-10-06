import { useState, useEffect, useCallback } from 'react';
import { SessionDevice, LoginHistoryItem } from '../types/session';
import { sessionsApi } from '../api/sessions';

export function useSessions() {
  const [sessions, setSessions] = useState<SessionDevice[]>([]);
  const [history, setHistory] = useState<LoginHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sessionsRes, historyRes] = await Promise.all([
        sessionsApi.getActiveSessions(),
        sessionsApi.getLoginHistory(),
      ]);
      setSessions(sessionsRes.sessions || []);
      setHistory(historyRes.history || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load session data.');
      setSessions([]);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const revokeSession = async (sessionId: string) => {
    await sessionsApi.revokeSession(sessionId);
    await fetchData();
  };

  return { sessions, history, isLoading, error, refetch: fetchData, revokeSession };
}
