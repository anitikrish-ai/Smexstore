/**
 * Seller Rating Data Model (DATA-006, FR-050, SEC-008)
 */

export interface Rating {
  id: string;
  buyerRef: {
    id: string;
    username: string;
  };
  sellerRef: {
    id: string;
    username: string;
  };
  listingRef: {
    id: string;
    gameTitle: string;
  };
  value: number; // 1-5 scale
  comment?: string;
  linkedCompletedPurchase: boolean;
  createdAt: string;
}

export interface CreateRatingPayload {
  sellerId: string;
  listingId: string;
  value: number;
  comment?: string;
}

export interface SellerRatingSummary {
  average: number;
  totalCount: number;
  ratings: Rating[];
}
