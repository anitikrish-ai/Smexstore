import { useState, useEffect, useCallback } from 'react';
import { Activity } from '../types/activity';
import { ActivityVisibility } from '../types/user';
import { activityApi } from '../api/activity';

export function useActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [visibility, setVisibility] = useState<ActivityVisibility>('public');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await activityApi.getActivityHistory();
      setActivities(response.activities || []);
      setVisibility(response.visibility || 'public');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load activity history.');
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const updateVisibility = async (newVisibility: ActivityVisibility) => {
    await activityApi.updateActivityVisibility(newVisibility);
    setVisibility(newVisibility);
  };

  const logEvent = async (event: string, eventDetails?: string) => {
    if (visibility === 'off') return;
    try {
      await activityApi.logActivity({ event, eventDetails });
    } catch {
      // Activity logging failure should never block UI interactions
    }
  };

  return {
    activities,
    visibility,
    isLoading,
    error,
    refetch: fetchActivity,
    updateVisibility,
    logEvent,
  };
}
