/**
 * Leaderboard API (API-008, FR-060, FR-061)
 */

import { apiClient } from './client';
import { LeaderboardData } from '../types/content';

export const leaderboardApi = {
  getLeaderboard: () => apiClient<LeaderboardData>('/leaderboard'),
};
