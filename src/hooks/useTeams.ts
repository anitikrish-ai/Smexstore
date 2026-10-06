import { useState, useEffect, useCallback } from 'react';
import { TeamGroup, CreateTeamPayload, TeamAvailability } from '../types/team';
import { teamsApi } from '../api/teams';

export function useTeams(filters?: { availability?: TeamAvailability; search?: string }) {
  const [teams, setTeams] = useState<TeamGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await teamsApi.getTeams(filters);
      setTeams(response.teams || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load teams.');
      setTeams([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.availability, filters?.search]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const createTeam = async (payload: CreateTeamPayload) => {
    const response = await teamsApi.createTeam(payload);
    await fetchTeams();
    return response.team;
  };

  const joinTeam = async (teamId: string, message?: string) => {
    const response = await teamsApi.joinTeam(teamId, message);
    await fetchTeams();
    return response.message;
  };

  return { teams, isLoading, error, refetch: fetchTeams, createTeam, joinTeam };
}

export function useTeamDetail(id: string) {
  const [team, setTeam] = useState<TeamGroup | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await teamsApi.getTeamById(id);
      setTeam(response.team);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load team details.');
      setTeam(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return { team, isLoading, error, refetch: fetchTeam };
}
