/**
 * API Transport & Error Types
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: Record<string, string>;
}

export interface AdminPlatformStats {
  totalUsers: number;
  activeListings: number;
  totalTournaments: number;
  openTeams: number;
}
