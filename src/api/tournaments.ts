/**
 * Tournaments API (API-003, FR-010 to FR-012)
 */

import { apiClient } from './client';
import { Tournament, TournamentFilters } from '../types/tournament';

export const tournamentsApi = {
  getTournaments: (filters?: TournamentFilters) =>
    apiClient<{ tournaments: Tournament[] }>('/tournaments', {
      params: {
        status: filters?.status,
        game: filters?.game,
        search: filters?.search,
        limit: filters?.limit,
      },
    }),

  getTournamentById: (id: string) =>
    apiClient<{ tournament: Tournament }>(`/tournaments/${encodeURIComponent(id)}`),

  getRecentTournaments: (limit = 5) =>
    apiClient<{ tournaments: Tournament[] }>('/tournaments', {
      params: { limit, status: 'current' },
    }),
};
