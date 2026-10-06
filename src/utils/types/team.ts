/**
 * Team & Group Data Model (DATA-004, FR-020 to FR-023)
 */

export type TeamAvailability = 'open' | 'closed';

export interface TeamMember {
  userId: string;
  username: string;
  inGameRole?: string;
  joinedAt: string;
  isLeader?: boolean;
}

export interface TeamGroup {
  id: string;
  name: string;
  description?: string;
  leaderId: string;
  leaderUsername: string;
  members: TeamMember[];
  memberCount: number;
  maxSlots: number;
  availability: TeamAvailability;
  score?: number;
  createdAt: string;
}

export interface CreateTeamPayload {
  name: string;
  description?: string;
  maxSlots: number;
}
