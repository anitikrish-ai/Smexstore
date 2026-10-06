/**
 * Static & Community Content Models (FR-002, FR-060, FR-070, FR-071)
 */

export interface BannerItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  type: 'update' | 'poster';
}

export interface SocialLinkItem {
  id: string;
  platform: string;
  handle: string;
  url: string;
}

export interface AboutUsInfo {
  ownerName: string;
  missionStatement: string;
  contactEmail: string;
  foundedYear: string;
  description: string;
}

export interface LeaderboardData {
  topTournaments: Array<{
    id: string;
    name: string;
    gameTitle: string;
    rating: number;
    ratingCount: number;
    prizePool?: string;
  }>;
  hotTeams: Array<{
    id: string;
    name: string;
    memberCount: number;
    maxSlots: number;
    availability: 'open' | 'closed';
    score: number;
  }>;
}
