/**
 * Teams & Groups API (API-004, FR-020 to FR-023)
 */

import { apiClient } from './client';
import { TeamGroup, CreateTeamPayload, TeamAvailability } from '../types/team';

export const teamsApi = {
  getTeams: (filters?: { availability?: TeamAvailability; search?: string }) =>
    apiClient<{ teams: TeamGroup[] }>('/teams', {
      params: {
        availability: filters?.availability,
        search: filters?.search,
      },
    }),

  getTeamById: (id: string) =>
    apiClient<{ team: TeamGroup }>(`/teams/${encodeURIComponent(id)}`),

  createTeam: (payload: CreateTeamPayload) =>
    apiClient<{ team: TeamGroup }>('/teams', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  joinTeam: (teamId: string, message?: string) =>
    apiClient<{ message: string }>(`/teams/${encodeURIComponent(teamId)}/join`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
};
