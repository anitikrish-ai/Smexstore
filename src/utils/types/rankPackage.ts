/**
 * Rank-Boosting Package Data Model (DATA-007, FR-050a to FR-050c)
 */

export interface ProviderDetails {
  providerName: string;
  providerContact?: string;
  verified: boolean;
}

export type RankPackageAvailability = 'available' | 'unavailable';

export interface RankPackage {
  id: string;
  title: string;
  description: string;
  gameTitle: string;
  providerDetails: ProviderDetails;
  price: number;
  currentRankTier: string;
  targetRankTier: string;
  estimatedDuration: string;
  availability: RankPackageAvailability;
  bookingsCount: number;
  createdAt?: string;
}

export interface RankBooking {
  id: string;
  packageId: string;
  userId: string;
  userContact: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface CreateBookingPayload {
  userContact: string;
  notes?: string;
}
