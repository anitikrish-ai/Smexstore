/**
 * Tournament Data Model (DATA-003, FR-010 to FR-012)
 */

export type TournamentStatus = 'past' | 'current' | 'future';

export interface Tournament {
  id: string;
  name: string;
  description: string;
  fullDetails: string;
  status: TournamentStatus;
  rating: number;
  ratingCount: number;
  startDate: string;
  endDate?: string;
  gameTitle: string;
  bannerUrl?: string;
  prizePool?: string;
  rules?: string;
  participantsCount?: number;
  maxParticipants?: number;
}

export interface TournamentFilters {
  status?: TournamentStatus;
  game?: string;
  search?: string;
  limit?: number;
}
